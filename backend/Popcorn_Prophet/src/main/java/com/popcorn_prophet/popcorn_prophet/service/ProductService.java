package com.popcorn_prophet.popcorn_prophet.service;


import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.CartRepository;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
<<<<<<< HEAD
import org.springframework.data.domain.PageRequest;
=======
>>>>>>> f089d1f86c675572ae9e0e3e457e2f65a0969cc9
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
<<<<<<< HEAD

    public Page<Product> productPagination(int page){
        return productRepository.findAll(PageRequest.of(page, 5));
    }


=======
>>>>>>> f089d1f86c675572ae9e0e3e457e2f65a0969cc9
}
