package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.DTO.ProductReviewCreateDTO;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.entity.ProductReview;
import com.popcorn_prophet.popcorn_prophet.repo.ProductReviewRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductService productService;
    private final MemberService memberService;

    public Page<ProductReview> getProductReviews(Long productId, int page) {
        return productReviewRepository.findAllByProductId(productId, PageRequest.of(page, 5, Sort.by("createdAt").descending()));

    }


    @Transactional
    public Optional<ProductReview> addProductReview(ProductReviewCreateDTO productReview, Long productId, Long memberId) {
        Optional<Product> product = productService.getProduct(productId);
        Optional<Member> member = memberService.getMember(memberId);
        if (product.isEmpty() || member.isEmpty()) {
            return Optional.empty();
        }
        ProductReview newProductReview = ProductReview.builder().review(productReview.getReview()).rating(productReview.getRating()).
                product(product.get()).member(member.get()).build();

        return Optional.of(productReviewRepository.save(newProductReview));
    }

    @Transactional
    public Optional<Boolean> deleteProductReview(Long productReviewId) {
        Optional<ProductReview> productReview = productReviewRepository.findById(productReviewId);
        if (productReview.isEmpty()) {
            return Optional.empty();
        }
        productReviewRepository.deleteById(productReviewId);
        return Optional.of(true);
    }

    public Optional<ProductReview> getProductReview(Long productReviewId) {
        Optional<ProductReview> productReview = productReviewRepository.findById(productReviewId);
        if (productReview.isEmpty()) {
            return Optional.empty();
        }
        return productReview;
    }

    @Transactional
    public Optional<ProductReview> updateProductReview(ProductReview productReview) {
        Optional<ProductReview> productReviewOptional = productReviewRepository.findById(productReview.getId());
        if (productReviewOptional.isEmpty()) {
            return Optional.empty();
        }
        ProductReview productReviewToUpdate = productReviewOptional.get();

        productReviewToUpdate.setRating(productReview.getRating());
        productReviewToUpdate.setReview(productReview.getReview());
        return Optional.of(productReviewRepository.save(productReviewToUpdate));
    }


}
