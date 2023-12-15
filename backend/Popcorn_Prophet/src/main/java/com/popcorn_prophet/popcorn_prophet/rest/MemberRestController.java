package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.config.PopcornProphetAuthenticationProvider;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.MemberResponse;
import com.popcorn_prophet.popcorn_prophet.entity.Role;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import com.popcorn_prophet.popcorn_prophet.repo.RoleRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@CrossOrigin(origins = "*")
@AllArgsConstructor
@RequestMapping("/auth")
public class MemberRestController {

    private MemberRepository memberRepository;
    private PasswordEncoder passwordEncoder;
    private RoleRepository roleRepository;
    private PopcornProphetAuthenticationProvider authenticationManager;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<MemberResponse> registerMember(@Valid @RequestBody Member member, Errors errors) {
        ResponseEntity<MemberResponse> mapErrors = getMemberResponseResponseEntity(errors);
        if (mapErrors != null) return mapErrors;

        if (memberRepository.findByEmail(member.getEmail()).isPresent() || memberRepository.findByUsername(member.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Email or username already exists", null, null));
        }

        if (!Objects.equals(member.getPassword(), member.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MemberResponse("Passwords do not match", null, null));
        }
        if(roleRepository.findByRoleName("User").isEmpty()){
            Role role = new Role();
            role.setRoleName("User");
            roleRepository.save(role);
        }


        Role role = roleRepository.findByRoleName("User").orElseThrow(() -> new RuntimeException("Role not found"));
        String hashedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(hashedPassword);
        member.getRoles().add(role);
        return ResponseEntity.ok(new MemberResponse("Member registered", memberRepository.save(member), null));
    }

    @GetMapping()
    public ResponseEntity<List<Member>> getMembers() {
        List<Member> members = memberRepository.findAll();
        for (Member member : members) {
            member.setPassword(null);
        }
        return ResponseEntity.ok(members);
    }

    @PostMapping("/login")
    public ResponseEntity<MemberResponse> loginMember(@Valid @RequestBody Member member, Errors errors){
        ResponseEntity<MemberResponse> mapErrors = getMemberResponseResponseEntity(errors);
        if (mapErrors != null) return mapErrors;
        try {

            Member mem = memberRepository.findByEmail(member.getEmail()).get();
            // TODO fix neskor, tak  aby netreba v body username
            if (!Objects.equals(mem.getUsername(), member.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MemberResponse("Invalid credentials", null, null));
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(member.getEmail(), member.getPassword()));
            return ResponseEntity.ok(new MemberResponse("Member logged in", mem, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MemberResponse("Invalid credentials", null, null));
        }

    }

    private ResponseEntity<MemberResponse> getMemberResponseResponseEntity(Errors errors) {
        if (errors.hasErrors()) {
            List<String> mapErrors = new ArrayList<>();
            for (ObjectError error : errors.getAllErrors()) {
                mapErrors.add( error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MemberResponse("Validation failed", null, mapErrors));
        }
        return null;
    }

}