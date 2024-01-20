package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.DTO.BillingInfoDTO;
import com.popcorn_prophet.popcorn_prophet.entity.BillingInfo;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.repo.BillingInfoRepository;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BillingInfoService {
    private final BillingInfoRepository billingInfoRepository;
    private final MemberRepository memberRepository;

    public Optional<BillingInfo> getBillingInfo(Long memberId) {
        Optional<Member> member = memberRepository.findById(memberId);
        if (member.isEmpty()) {
            return Optional.empty();
        }
        return Optional.ofNullable(member.get().getBillingInfo());
    }

    @Transactional
    public Optional<BillingInfo> changeBillingInfo(BillingInfoDTO billingInfo, Long memberId) {

        Optional<Member> memberOptional = memberRepository.findById(memberId);
        if (memberOptional.isEmpty()) {
            return Optional.empty();
        }
        Member member = memberOptional.get();
        BillingInfo newBillingInfo = member.getBillingInfo();
        newBillingInfo.setFirstName(billingInfo.getFirstName());
        newBillingInfo.setLastName(billingInfo.getLastName());
        newBillingInfo.setEmail(billingInfo.getEmail());
        newBillingInfo.setPostalCode(billingInfo.getPostalCode());
        newBillingInfo.setAddress(billingInfo.getAddress());
        newBillingInfo.setCity(billingInfo.getCity());
        newBillingInfo.setCountry(billingInfo.getCountry());
        newBillingInfo.setPaymentMethod(billingInfo.getPaymentMethod());
//TEST
        memberRepository.save(member);
        return Optional.of(newBillingInfo);

    }
}
