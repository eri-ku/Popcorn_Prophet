package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.DTO.ProductReviewCreateDTO;
import com.popcorn_prophet.popcorn_prophet.POJO.ProductPageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.ReviewPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.ProductReview;
import com.popcorn_prophet.popcorn_prophet.service.MemberService;
import com.popcorn_prophet.popcorn_prophet.service.ProductReviewService;
import com.popcorn_prophet.popcorn_prophet.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/products/productReview")
public class ProductReviewRestController {
    private final ProductReviewService productReviewService;


    @GetMapping({"/{productId}"})
    public ResponseEntity<ReviewPageResponse> getProductReviews(@PathVariable Long productId, @RequestParam(defaultValue = "0") int page) {
        ReviewPageResponse reviewPageResponse =  ReviewPageResponse.builder()
                .reviews(productReviewService.getProductReviews(productId,page).getContent())
                .totalPages(productReviewService.getProductReviews(productId,page).getTotalPages())
                .build();
        return ResponseEntity.ok(reviewPageResponse);
    }



    @PostMapping({"/{productId}/{memberId}"})
    public ResponseEntity<ProductReview> addProductReview(@RequestBody ProductReviewCreateDTO productReview, @PathVariable Long productId, @PathVariable Long memberId){

        return ResponseEntity.ok(productReviewService.addProductReview(productReview,productId,memberId));
    }


    @PreAuthorize("@securityService.hasAccessToModifyProductReview(#productReviewId) || hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @DeleteMapping({"/{productReviewId}"})
    public ResponseEntity<ProductReview> deleteProductReview(@PathVariable Long productReviewId){
        productReviewService.deleteProductReview(productReviewId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("@securityService.hasAccessToModifyProductReview(#productReview.id)")
    @PutMapping()
    public ResponseEntity<ProductReview> updateProductReview(@RequestBody ProductReview productReview){
        ProductReview productReviewToEdit = productReviewService.getProductReview(productReview.getId());
        productReviewToEdit.setRating(productReview.getRating());
        productReviewToEdit.setReview(productReview.getReview());
        return ResponseEntity.ok(productReviewService.updateProductReview(productReviewToEdit));
    }


}
