package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.DTO.ProductReviewCreateDTO;
import com.popcorn_prophet.popcorn_prophet.entity.ProductReview;
import com.popcorn_prophet.popcorn_prophet.repo.ProductReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductService productService;
    private final MemberService memberService;

    public Page<ProductReview> getProductReviews(Long productId,int page) {
        return productReviewRepository.findAllByProductId(productId, PageRequest.of(page, 5));

    }



    public ProductReview addProductReview(ProductReviewCreateDTO productReview, Long productId, Long memberId) {
        ProductReview newProductReview = ProductReview.builder().review(productReview.getReview()).rating(productReview.getRating()).
                product(productService.getProduct(productId)).member(memberService.getMember(memberId)).build();

        return productReviewRepository.save(newProductReview);
    }

    public void deleteProductReview(Long productReviewId) {
        productReviewRepository.deleteById(productReviewId);
    }

    public ProductReview getProductReview(Long productReviewId) {
        return productReviewRepository.findById(productReviewId).get();
    }

    public ProductReview updateProductReview(ProductReview productReview) {
        return productReviewRepository.save(productReview);
    }



}
