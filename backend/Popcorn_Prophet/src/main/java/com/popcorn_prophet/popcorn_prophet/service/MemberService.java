package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.ArticleComment;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    public Member getMember(Long memberId) {
        return this.memberRepository.findById(memberId).get();
    }

    public Page<Member> getMembers(int page) {
        return memberRepository.findAll(PageRequest.of(page,5));

    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }
}
