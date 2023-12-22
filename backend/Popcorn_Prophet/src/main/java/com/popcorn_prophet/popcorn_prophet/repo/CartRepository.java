package com.popcorn_prophet.popcorn_prophet.repo;

import com.popcorn_prophet.popcorn_prophet.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;



public interface CartRepository extends JpaRepository<Cart, Long> {
}
