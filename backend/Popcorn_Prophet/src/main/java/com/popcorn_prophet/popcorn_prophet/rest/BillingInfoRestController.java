package com.popcorn_prophet.popcorn_prophet.rest;


import com.popcorn_prophet.popcorn_prophet.entity.BillingInfo;
import com.popcorn_prophet.popcorn_prophet.service.BillingInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/billingInfo")
public class BillingInfoRestController {
    private final BillingInfoService billingInfoService;

    @GetMapping({"/{memberId}"})
    public ResponseEntity<BillingInfo> getBillingInfo(@PathVariable() Long memberId) {
        return ResponseEntity.ok(billingInfoService.getBillingInfo(memberId));
    }

    @PreAuthorize("@securityService.hasAccessToModifyBillingInfo(#billingInfo.id)")
    @PutMapping({"/{memberId}"})
    public ResponseEntity<BillingInfo> changeBillingInfo(@RequestBody BillingInfo billingInfo, @PathVariable() Long memberId){
        return ResponseEntity.ok(billingInfoService.addBillingInfo(billingInfo, memberId));
    }

}
