package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "cart_item")
@JsonInclude(JsonInclude.Include.NON_NULL)

public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity =1;

    @ManyToOne()
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    private Cart cart;

    @ManyToOne()
    @JoinColumn(name = "product_id",referencedColumnName = "id",nullable = false)
    private Product product;

private int price= (int) (Math.random() * 50) +10;


}
