package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Cart extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "cart",cascade = CascadeType.ALL, orphanRemoval = true)
    @MapKey(name = "product")
    @JsonIgnoreProperties("cart")
    private Map<Product, CartItem> cartItems = new HashMap<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Member member;
    private int totalPriceOfCart = 0;
    public void addItem(Product product) {
        CartItem cartItem;

        if (cartItems.containsKey(product)) {
            cartItem = cartItems.get(product);

            cartItems.get(product).setQuantity(cartItem.getQuantity()+1);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(this);
            cartItem.setProduct(product);
            this.cartItems.put(product, cartItem);
        }
        this.totalPriceOfCart += cartItem.getPrice();
    }
    public void removeItem(Product key) {
        CartItem cartItem = cartItems.get(key);
        if(cartItem == null) return;
        this.totalPriceOfCart-= cartItem.getPrice() * cartItem.getQuantity();
        this.cartItems.remove(key);
    }
    public void changeQuantity(Product key, int quantity) {
        CartItem cartItem = cartItems.get(key);
        this.totalPriceOfCart -= cartItem.getPrice() * cartItem.getQuantity();
        cartItem.setQuantity(quantity);
        this.totalPriceOfCart += cartItem.getPrice() * cartItem.getQuantity();
    }
    public void recalculateTotalPrice() {
        this.totalPriceOfCart = 0;
        for (CartItem cartItem : cartItems.values()) {
            this.totalPriceOfCart += cartItem.getPrice() * cartItem.getQuantity();
        }
    }
    public void clearCart() {
        this.totalPriceOfCart = 0;
        this.cartItems.clear();
    }
}
