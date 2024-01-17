package com.popcorn_prophet.popcorn_prophet.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.popcorn_prophet.popcorn_prophet.POJO.MemberResponse;
import com.popcorn_prophet.popcorn_prophet.entity.*;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import com.popcorn_prophet.popcorn_prophet.repo.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        return memberRepository.findAll(PageRequest.of(page,5));

    }

    public Optional<Boolean> deleteMember(Long id) {
        Optional<Member> memberToDelete = memberRepository.findById(id);
        if(memberToDelete.isPresent()){
            memberRepository.deleteById(id);
            return Optional.of(true);
        }
        return Optional.empty();
    }

    public Optional<Member> updateRoles(Long id, JsonNode rolesNames) {
        Optional<Member> member = memberRepository.findById(id);
        if(member.isEmpty()){
            return Optional.empty();
        }
        Set<Role> roles = new HashSet<>();
        rolesNames.get("role").forEach(roleName -> {
            Optional<Role> role = roleRepository.findByRoleName(roleName.asText());
            if(role.isPresent()){
                roles.add(role.get());
            }
        });
        if(!roles.isEmpty()){
            member.get().setRoles(roles);
        }
        return Optional.of(memberRepository.save(member.get()));
    }


    public Optional<Member> updateEmail(Long memberId, JsonNode email) {

        Optional<Member> member = memberRepository.findById(memberId);
        if(member.isEmpty()){
            return Optional.empty();
        }
        member.get().setEmail(email.get("email").asText());
        return Optional.of(memberRepository.save(member.get()));
    }

    public MemberResponse updatePassword(Long memberId, JsonNode password) {
        Optional<Member> member = memberRepository.findById(memberId);
        if(member.isEmpty()){
            return new MemberResponse("Member not found", null, null, null);
        }
        Member memberToUpdate = member.get();

        if(!passwordEncoder.matches(password.get("oldPassword").asText(), memberToUpdate.getPassword())){
            return new MemberResponse("Old password is incorrect", null, null, null);
        }

        if(!(password.get("newPassword").asText().equals(password.get("repeatPassword").asText()))){
            return new MemberResponse("New password and repeat password are not the same", null, null, null);
        }
        memberToUpdate.setPassword(passwordEncoder.encode(password.get("newPassword").asText()));

        return new MemberResponse("Password updated", memberRepository.save(memberToUpdate), memberToUpdate.getCart().getId(), null);
    }

    public Optional<Member> getMemberByEmail(String email){

        return memberRepository.findByEmail(email);
    }

    public boolean emailOrUsernameAlreadyExists(String email, String username){
        return memberRepository.findByEmail(email).isPresent() || memberRepository.findByUsername(username).isPresent();
    }

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

        return new MemberResponse("Member registered", memberRepository.save(member), member.getCart().getId(), null);
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
