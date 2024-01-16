package com.popcorn_prophet.popcorn_prophet.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.popcorn_prophet.popcorn_prophet.POJO.MemberResponse;
import com.popcorn_prophet.popcorn_prophet.entity.ArticleComment;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.Role;
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
    public Member getMember(Long memberId) {
        return this.memberRepository.findById(memberId).get();
    }

    public Page<Member> getMembers(int page) {
        return memberRepository.findAll(PageRequest.of(page,5));

    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    public Member updateRoles(Long id, JsonNode rolesNames) {
        Member member = memberRepository.findById(id).get();
        Set<Role> roles = new HashSet<>();
        rolesNames.get("role").forEach(roleName -> {
            Role role = roleRepository.findByRoleName(roleName.asText()).get();
            roles.add(role);
        });
        member.setRoles(roles);

        return memberRepository.save(member);
    }


    public Member updateEmail(Long memberId, JsonNode email) {
        Member member = memberRepository.findById(memberId).get();
        member.setEmail(email.get("email").asText());
        return memberRepository.save(member);
    }

    public MemberResponse updatePassword(Long memberId, JsonNode password) {
        Member member = memberRepository.findById(memberId).get();

        if(!passwordEncoder.matches(password.get("oldPassword").asText(), member.getPassword())){
            return new MemberResponse("Old password is incorrect", null, null, null);
        }

        if(!(password.get("newPassword").asText().equals(password.get("repeatPassword").asText()))){
            return new MemberResponse("New password and repeat password are not the same", null, null, null);
        }
        member.setPassword(passwordEncoder.encode(password.get("newPassword").asText()));

        return new MemberResponse("Password updated", memberRepository.save(member), member.getCart().getId(), null);
    }

    public Member getMemberByEmail(String email){
        return memberRepository.findByEmail(email).get();
    }
}
