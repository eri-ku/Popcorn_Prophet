package com.popcorn_prophet.popcorn_prophet.repo;

import com.popcorn_prophet.popcorn_prophet.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

}
