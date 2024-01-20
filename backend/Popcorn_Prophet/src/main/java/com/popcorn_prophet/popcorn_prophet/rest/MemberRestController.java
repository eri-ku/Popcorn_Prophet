package com.popcorn_prophet.popcorn_prophet.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.popcorn_prophet.popcorn_prophet.DTO.MemberLoginDTO;
import com.popcorn_prophet.popcorn_prophet.POJO.MemberPageResponse;
import com.popcorn_prophet.popcorn_prophet.config.PopcornProphetAuthenticationProvider;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.POJO.MemberResponse;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import com.popcorn_prophet.popcorn_prophet.repo.RoleRepository;
import com.popcorn_prophet.popcorn_prophet.service.CartService;
import com.popcorn_prophet.popcorn_prophet.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
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
    SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<MemberResponse> registerMember(@Valid @RequestBody Member member) {

        if (memberService.emailOrUsernameAlreadyExists(member.getEmail(), member.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Email or username already exists", null, null));
        }
        if (!Objects.equals(member.getPassword(), member.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Passwords do not match", null, null));
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
    public ResponseEntity<MemberResponse> updateEmail(@PathVariable Long memberId, @RequestBody JsonNode email) {
        return memberService.updateEmail(memberId, email);
    }
    @PreAuthorize("@securityService.hasAccessToModifyMember(#memberId)")
    @PatchMapping("/password/{memberId}")
    public ResponseEntity<MemberResponse> updatePassword(@PathVariable Long memberId, @RequestBody JsonNode password) {
        return memberService.updatePassword(memberId, password);
    }

    @PostMapping("/login")
    public ResponseEntity<MemberResponse> loginMember(@Valid @RequestBody MemberLoginDTO member){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(member.getEmail(), member.getPassword()));

            Optional<Member> mem = memberService.getMemberByEmail(member.getEmail());
            return ResponseEntity.ok(new MemberResponse("Member logged in", mem.get(), mem.get().getCart().getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MemberResponse("Invalid credentials", null, null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<MemberResponse> logoutMember(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        this.logoutHandler.logout(request, response, authentication);
        return ResponseEntity.ok(new MemberResponse("Member logged out", null, null));
    }
}