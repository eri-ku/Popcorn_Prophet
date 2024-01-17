package com.popcorn_prophet.popcorn_prophet.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.popcorn_prophet.popcorn_prophet.DTO.MemberDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
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
        if (memberService.emailOrUsernameAlreadyExists(member.getEmail(), member.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Email or username already exists", null, null, null));
        }
        if (!Objects.equals(member.getPassword(), member.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Passwords do not match", null, null, null));
        }

        return new ResponseEntity<>(memberService.registerMember(member), HttpStatus.CREATED);
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping()
    public ResponseEntity<MemberPageResponse> getMembers(@RequestParam(defaultValue = "0") int page) {
        MemberPageResponse members = MemberPageResponse.builder().members(memberService.getMembers(page)
                .getContent()).totalPages(memberService.getMembers(page).getTotalPages()).build();

        return ResponseEntity.ok(members);
    }


    @PreAuthorize("@securityService.hasAccessToModifyMember(#memberId) || hasAnyRole('ROLE_ADMIN')")
    @GetMapping("/{memberId}")
    public ResponseEntity<Member> getMember(@PathVariable Long memberId) {
        Optional<Member> member = memberService.getMember(memberId);
        if (member.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(member.get());

    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long memberId) {
        Optional<Boolean> success = this.memberService.deleteMember(memberId);
        if (success.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/role/{memberId}")
    public ResponseEntity<Member> updateRoles(@PathVariable Long memberId, @RequestBody JsonNode roleNames) {
        Optional<Member> member = memberService.updateRoles(memberId, roleNames);
        if (member.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(member.get());
    }


    @PreAuthorize("@securityService.hasAccessToModifyMember(#memberId)")
    @PatchMapping("/email/{memberId}")
    public ResponseEntity<Member> updateEmail(@PathVariable Long memberId, @RequestBody JsonNode email) {
        Optional<Member> member = memberService.updateEmail(memberId, email);
        if (member.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(member.get());
    }

    @PreAuthorize("@securityService.hasAccessToModifyMember(#memberId)")
    @PatchMapping("/password/{memberId}")
    public ResponseEntity<MemberResponse> updatePassword(@PathVariable Long memberId, @RequestBody JsonNode password) {
        return ResponseEntity.ok(memberService.updatePassword(memberId, password));
    }

/*
    @PostMapping("/login")
    public ResponseEntity<MemberResponse> loginMember(@Valid @RequestBody Member member, Errors errors) {
        ResponseEntity<MemberResponse> mapErrors = getMemberResponseResponseEntity(errors);
        if (mapErrors != null) return mapErrors;
 */
    @PostMapping("/login")
    public ResponseEntity<MemberResponse> loginMember(@RequestBody MemberDTO member) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(member.getEmail(), member.getPassword()));
            Optional<Member> mem = memberRepository.findByEmail(member.getEmail());
            return ResponseEntity.ok(new MemberResponse("Member logged in", mem.get(), mem.get().getCart().getId(), null));
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