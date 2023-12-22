package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.CartItem;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.CartRepository;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.popcorn_prophet.popcorn_prophet.entity.Cart;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void addItemToCart(Long cartId, Long productId) {
        Cart cart = this.cartRepository.findById(cartId).get();
        Product product = this.productRepository.findById(productId).get();
        cart.addItem(product);
        this.cartRepository.save(cart);
    }

    @Transactional
    public void removeItemFromCart(Long cartId, Long productId) {
        Cart cart = this.cartRepository.findById(cartId).get();
        cart.removeItem(productId);
        this.cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = this.cartRepository.findById(cartId).get();
        cart.clearCart();
        this.cartRepository.save(cart);
    }

    public Collection<CartItem> getCartItems(Long id) {
        return this.cartRepository.findById(id).get().getCartItems().values();
    }

    public Cart getCart(Long id) {
        return this.cartRepository.findById(id).get();
    }

    public Cart createCart(Member member){
        Cart cart = new Cart();
        cart.setMember(member);
        return this.cartRepository.save(cart);
    }

}
