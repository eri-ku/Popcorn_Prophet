package com.popcorn_prophet.popcorn_prophet.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
private String review;
private double rating;

@ManyToOne()
@JsonIgnoreProperties("memberProductReviews")
//http://springquay.blogspot.com/2016/01/new-approach-to-solve-json-recursive.html
@JoinColumn(name = "member_id",referencedColumnName = "id",nullable = false)
private Member member;

@ManyToOne()
@JsonIgnoreProperties("productReviews")
@JoinColumn(name = "product_id",referencedColumnName = "id",nullable = false)
private Product product;

}
