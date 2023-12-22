package com.popcorn_prophet.popcorn_prophet.service;


import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;



}
