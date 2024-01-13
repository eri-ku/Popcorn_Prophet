package com.popcorn_prophet.popcorn_prophet.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.popcorn_prophet.popcorn_prophet.POJO.MemberPageResponse;
import com.popcorn_prophet.popcorn_prophet.config.PopcornProphetAuthenticationProvider;
import com.popcorn_prophet.popcorn_prophet.entity.BillingInfo;
import com.popcorn_prophet.popcorn_prophet.entity.Cart;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.POJO.MemberResponse;
import com.popcorn_prophet.popcorn_prophet.entity.Role;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import com.popcorn_prophet.popcorn_prophet.repo.RoleRepository;
import com.popcorn_prophet.popcorn_prophet.service.CartService;
import com.popcorn_prophet.popcorn_prophet.service.MemberService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping("/auth")
public class MemberRestController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final CartService cartService;
    private final PopcornProphetAuthenticationProvider authenticationManager;
    private final MemberService memberService;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<MemberResponse> registerMember(@Valid @RequestBody Member member, Errors errors) {

        ResponseEntity<MemberResponse> mapErrors = getMemberResponseResponseEntity(errors);
        if (mapErrors != null) return mapErrors;

        if (memberRepository.findByEmail(member.getEmail()).isPresent() || memberRepository.findByUsername(member.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Email or username already exists", null, null, null));
        }

        if (!Objects.equals(member.getPassword(), member.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Passwords do not match", null, null, null));
        }

        if (roleRepository.count() < 3) createBaseRoles();


        Cart cart = cartService.createCart(member);
        member.setCart(cart);

        BillingInfo billingInfo = new BillingInfo();
        member.setBillingInfo(billingInfo);
        String hashedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(hashedPassword);

        Set<Role> roles = new HashSet<>();

        roles.add(roleRepository.findByRoleName("USER").get());
        if (member.getUsername().equals("Admin")) {
            roles.add(roleRepository.findByRoleName("MODERATOR").get());
            roles.add(roleRepository.findByRoleName("ADMIN").get());
            roles.add(roleRepository.findByRoleName("USER").get());
        }
        member.setRoles(roles);

        return ResponseEntity.ok(new MemberResponse("Member registered", memberRepository.save(member), member.getCart().getId(), null));
    }

    private void createBaseRoles() {
        if (roleRepository.findByRoleName("ADMIN").isEmpty()) {
            Role role = Role.builder().roleName("ADMIN").build();
            roleRepository.save(role);
        }
        if (roleRepository.findByRoleName("MODERATOR").isEmpty()) {
            Role role = Role.builder().roleName("MODERATOR").build();
            roleRepository.save(role);
        }
        if (roleRepository.findByRoleName("USER").isEmpty()) {
            Role role = Role.builder().roleName("USER").build();
            roleRepository.save(role);
        }
    }

    @GetMapping()
    public ResponseEntity<MemberPageResponse> getMembers(@RequestParam(defaultValue = "0") int page) {
        MemberPageResponse members = MemberPageResponse.builder().members(memberService.getMembers(page)
                .getContent()).totalPages(memberService.getMembers(page).getTotalPages()).build();

        return ResponseEntity.ok(members);
    }
    @GetMapping("/{memberId}")
    public ResponseEntity<Member> getMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(memberService.getMember(memberId));
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long memberId) {
        this.memberService.deleteMember(memberId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/role/{memberId}")
    public ResponseEntity<Member> updateRoles(@PathVariable Long memberId, @RequestBody JsonNode roleNames) {
        return ResponseEntity.ok(memberService.updateRoles(memberId, roleNames));
    }

    @PatchMapping("/email/{memberId}")
    public ResponseEntity<Member> updateEmail(@PathVariable Long memberId, @RequestBody JsonNode email) {
        return ResponseEntity.ok(memberService.updateEmail(memberId, email));
    }

    @PatchMapping("/password/{memberId}")
    public ResponseEntity<MemberResponse> updatePassword(@PathVariable Long memberId, @RequestBody JsonNode password) {
        MemberResponse memberResponse = memberService.updatePassword(memberId, password);
        return ResponseEntity.ok(memberService.updatePassword(memberId, password));
    }


    @PostMapping("/login")
    public ResponseEntity<MemberResponse> loginMember(@Valid @RequestBody Member member, Errors errors) {
        ResponseEntity<MemberResponse> mapErrors = getMemberResponseResponseEntity(errors);
        if (mapErrors != null) return mapErrors;
        try {

            Member mem = memberRepository.findByUsername(member.getUsername()).get();


            // TODO fix neskor, tak  aby netreba v body username
            if (!Objects.equals(mem.getUsername(), member.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MemberResponse("Invalid credentials", null, null, null));
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(member.getEmail(), member.getPassword()));
            MemberResponse memberResponse = new MemberResponse("Member logged in", mem, mem.getCart().getId(), null);
            return ResponseEntity.ok(memberResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MemberResponse("Invalid credentials", null, null, null));
        }
    }

    private ResponseEntity<MemberResponse> getMemberResponseResponseEntity(Errors errors) {
        if (errors.hasErrors()) {
            List<String> mapErrors = new ArrayList<>();
            for (ObjectError error : errors.getAllErrors()) {
                mapErrors.add(error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MemberResponse("Validation failed", null, null, mapErrors));
        }
        return null;
    }

}