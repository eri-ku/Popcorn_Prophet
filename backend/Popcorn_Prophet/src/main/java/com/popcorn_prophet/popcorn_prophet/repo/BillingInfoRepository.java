package com.popcorn_prophet.popcorn_prophet.repo;

import com.popcorn_prophet.popcorn_prophet.entity.BillingInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingInfoRepository extends JpaRepository<BillingInfo, Long> {
}
