package com.popcorn_prophet.popcorn_prophet.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductReview extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Review cannot be blank")
    @Size(min = 2, max = 255, message = "Review must be between 2 and 255 characters")
    @Column(name = "review", nullable = false)
    private String review;

    @NotBlank(message = "Rating cannot be blank")
    @Pattern(regexp = "^(0(\\.[05])?|([1-4](\\.[05])?)|5(\\.0)?)$", message = "Rating must be between 0.0 and 5.0, only icrements of 0.5 are allowed")
    @Column(name = "rating", nullable = false)
    private String rating;

    @ManyToOne()
    @JsonIgnoreProperties("memberProductReviews")
//http://springquay.blogspot.com/2016/01/new-approach-to-solve-json-recursive.html
    @JoinColumn(name = "member_id", referencedColumnName = "id", nullable = false)
    private Member member;

    @ManyToOne()
    @JsonIgnoreProperties("productReviews")
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product;
}
