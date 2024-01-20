package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.DTO.ProductReviewCreateDTO;
import com.popcorn_prophet.popcorn_prophet.POJO.ProductPageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.ReviewPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.ProductReview;
import com.popcorn_prophet.popcorn_prophet.service.MemberService;
import com.popcorn_prophet.popcorn_prophet.service.ProductReviewService;
import com.popcorn_prophet.popcorn_prophet.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@RequestMapping("/products/productReview")
public class ProductReviewRestController {
    private final ProductReviewService productReviewService;


    @GetMapping({"/{productId}"})
    public ResponseEntity<ReviewPageResponse> getProductReviews(@PathVariable Long productId, @RequestParam(defaultValue = "0") int page) {
        ReviewPageResponse reviewPageResponse = ReviewPageResponse.builder()
                .reviews(productReviewService.getProductReviews(productId, page).getContent())
                .totalPages(productReviewService.getProductReviews(productId, page).getTotalPages())
                .build();
        return ResponseEntity.ok(reviewPageResponse);
    }


    @PostMapping({"/{productId}/{memberId}"})
    public ResponseEntity<ProductReview> addProductReview(@Valid @RequestBody ProductReviewCreateDTO productReview, @PathVariable Long productId, @PathVariable Long memberId
    ) {
        Optional<ProductReview> productReviewOptional = productReviewService.addProductReview(productReview, productId, memberId);
        if (productReviewOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return new ResponseEntity<>(productReviewOptional.get(), HttpStatus.CREATED);
    }


    @PreAuthorize("@securityService.hasAccessToModifyProductReview(#productReviewId) || hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @DeleteMapping({"/{productReviewId}"})
    public ResponseEntity<ProductReview> deleteProductReview(@PathVariable Long productReviewId) {
        Optional<Boolean> isDeleted = productReviewService.deleteProductReview(productReviewId);
        if (isDeleted.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("@securityService.hasAccessToModifyProductReview(#productReview.id)")
    @PutMapping()
    public ResponseEntity<ProductReview> updateProductReview(@Valid @RequestBody ProductReview productReview) {
        Optional<ProductReview> productReviewOptional = productReviewService.updateProductReview(productReview);
        if (productReviewOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productReviewOptional.get());
    }


}
