package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.BillingInfo;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.repo.BillingInfoRepository;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BillingInfoService {
    private final BillingInfoRepository billingInfoRepository;
    private final MemberRepository memberRepository;

    public BillingInfo getBillingInfo(Long memberId) {
        return  memberRepository.findById(memberId).get().getBillingInfo();
    }

    public BillingInfo addBillingInfo(BillingInfo billingInfo, Long memberId) {

        Member member = memberRepository.findById(memberId).get();
        BillingInfo billingInfo1 = billingInfoRepository.save(billingInfo);
        member.setBillingInfo(billingInfo);
        return billingInfo1;

    }
}
