package com.popcorn_prophet.popcorn_prophet.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.popcorn_prophet.popcorn_prophet.POJO.MemberResponse;
import com.popcorn_prophet.popcorn_prophet.entity.*;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import com.popcorn_prophet.popcorn_prophet.repo.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartService cartService;

    public Optional<Member> getMember(Long memberId) {
        return this.memberRepository.findById(memberId);
    }

    public Page<Member> getMembers(int page) {
        return memberRepository.findAll(PageRequest.of(page, 5, Sort.by("createdAt").descending()));

    }

    @Transactional
    public Optional<Boolean> deleteMember(Long id) {
        Optional<Member> memberToDelete = memberRepository.findById(id);
        if (memberToDelete.isPresent()) {
            memberRepository.deleteById(id);
            return Optional.of(true);
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<Member> updateRoles(Long id, JsonNode rolesNames) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty()) {
            return Optional.empty();
        }
        Set<Role> roles = new HashSet<>();
        rolesNames.get("role").forEach(roleName -> {
            Optional<Role> role = roleRepository.findByRoleName(roleName.asText());
            if (role.isPresent()) {
                roles.add(role.get());
            }
        });
        if (!roles.isEmpty()) {
            roles.add(roleRepository.findByRoleName("ROLE_USER").get());
            member.get().setRoles(roles);
        }
        return Optional.of(memberRepository.save(member.get()));
    }


    @Transactional
    public ResponseEntity<MemberResponse> updateEmail(Long memberId, JsonNode email) {

        Optional<Member> member = memberRepository.findById(memberId);
        if (member.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!email.get("email").asText().contains("@") || !email.get("email").asText().contains(".") || email.get("email").asText().length() < 6) {
            return new ResponseEntity<>(new MemberResponse("Email is not valid", null, null), HttpStatus.BAD_REQUEST);
        }
        if (memberRepository.findByEmail(email.get("email").asText()).isPresent()) {
            return new ResponseEntity<>(new MemberResponse("Email already exists", null, null), HttpStatus.BAD_REQUEST);
        }
        member.get().setEmail(email.get("email").asText());
        return new ResponseEntity<>(new MemberResponse("Email updated", memberRepository.save(member.get()), member.get().getCart().getId()), HttpStatus.OK);
    }


    @Transactional
    public ResponseEntity<MemberResponse> updatePassword(Long memberId, JsonNode password) {
        Optional<Member> member = memberRepository.findById(memberId);
        if (member.isEmpty()) {
            return new ResponseEntity<>(new MemberResponse("Member not found", null, null), HttpStatus.NOT_FOUND);
        }
        Member memberToUpdate = member.get();

        if (!passwordEncoder.matches(password.get("oldPassword").asText(), memberToUpdate.getPassword())) {
            return new ResponseEntity<>(new MemberResponse("Old password is not correct", null, null), HttpStatus.BAD_REQUEST);
        }

        if (!(password.get("newPassword").asText().equals(password.get("repeatPassword").asText()))) {
            return new ResponseEntity<>(new MemberResponse("Passwords do not match", null, null), HttpStatus.BAD_REQUEST);
        }
        if (password.get("newPassword").asText().length() < 6) {
            return new ResponseEntity<>(new MemberResponse("New password must be at least 6 characters", null, null), HttpStatus.BAD_REQUEST);
        }
        if (!password.get("newPassword").asText().matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$&+,:;=?@#|'<>.^*()%!-]).{6,}$"))
        {
            return new ResponseEntity<>(new MemberResponse("Password must match atleast: 1 uppercase, 1 lowercase, 1 number, 1 special character", null, null), HttpStatus.BAD_REQUEST);
        }
        memberToUpdate.setPassword(passwordEncoder.encode(password.get("newPassword").asText()));

        return new ResponseEntity<>(new MemberResponse("Password updated", memberRepository.save(memberToUpdate), memberToUpdate.getCart().getId()), HttpStatus.OK);
    }

    public Optional<Member> getMemberByEmail(String email) {

        return memberRepository.findByEmail(email);
    }

    public boolean emailOrUsernameAlreadyExists(String email, String username) {
        return memberRepository.findByEmail(email).isPresent() || memberRepository.findByUsername(username).isPresent();
    }

    @Transactional
    public MemberResponse registerMember(Member member) {
        if (roleRepository.count() < 3) createBaseRoles();

        Cart cart = cartService.createCart(member);
        member.setCart(cart);
        BillingInfo billingInfo = new BillingInfo();
        member.setBillingInfo(billingInfo);
        String hashedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(hashedPassword);

        Set<Role> roles = new HashSet<>();

        roles.add(roleRepository.findByRoleName("ROLE_USER").get());
        if (member.getUsername().equals("Admin")) {
            roles.add(roleRepository.findByRoleName("ROLE_ADMIN").get());
            roles.add(roleRepository.findByRoleName("ROLE_MODERATOR").get());
            roles.add(roleRepository.findByRoleName("ROLE_USER").get());
        }
        member.setRoles(roles);

        return new MemberResponse("Member registered", memberRepository.save(member), member.getCart().getId());
    }

    public Optional<Member> findMemberByUsername(String username) {
        return memberRepository.findByUsername(username);
    }

    private void createBaseRoles() {
        if (roleRepository.findByRoleName("ROLE_ADMIN").isEmpty()) {
            Role role = Role.builder().roleName("ROLE_ADMIN").build();
            roleRepository.save(role);
        }
        if (roleRepository.findByRoleName("ROLE_MODERATOR").isEmpty()) {
            Role role = Role.builder().roleName("ROLE_MODERATOR").build();
            roleRepository.save(role);
        }
        if (roleRepository.findByRoleName("ROLE_USER").isEmpty()) {
            Role role = Role.builder().roleName("ROLE_USER").build();
            roleRepository.save(role);
        }

    }
}
