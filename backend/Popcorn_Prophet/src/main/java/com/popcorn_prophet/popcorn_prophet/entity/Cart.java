package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @OneToMany(mappedBy = "cart",fetch = FetchType.EAGER,cascade = CascadeType.ALL, orphanRemoval = true)
    private Map<Long, CartItem> cartItems = new HashMap<>();

    @OneToOne(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Member member;
    private int totalPriceOfCart = 0;

    public void addItem(Product product) {
        CartItem cartItem;

        if (cartItems.containsKey(product.getId())) {
            cartItem = cartItems.get(product.getId());

            cartItems.get(product.getId()).setQuantity(cartItem.getQuantity()+1);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(this);
            cartItem.setProduct(product);
            this.cartItems.put(product.getId(), cartItem);
        }
        this.totalPriceOfCart += cartItem.getPrice();
    }

    public void removeItem(Long key) {
        this.totalPriceOfCart-= cartItems.get(key).getPrice() * cartItems.get(key).getQuantity();
        this.cartItems.remove(key);
    }

    public void clearCart() {
        this.totalPriceOfCart = 0;
        this.cartItems.clear();
    }

}
