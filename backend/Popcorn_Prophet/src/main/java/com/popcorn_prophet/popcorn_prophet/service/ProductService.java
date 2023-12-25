package com.popcorn_prophet.popcorn_prophet.service;


import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.CartRepository;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
