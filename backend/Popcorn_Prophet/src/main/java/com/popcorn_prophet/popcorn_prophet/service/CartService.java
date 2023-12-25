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
import java.util.List;

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

        cart.removeItem(this.productRepository.findById(productId).get());
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


    public void setItemQuantity(Long cartId, Long productId, int quantity) {
        Cart cart = this.cartRepository.findById(cartId).get();
        Product product = this.productRepository.findById(productId).get();
        cart.changeQuantity(product, quantity);
        this.cartRepository.save(cart);
    }

    public CartItem getCartItem(Long cartId, Long productId) {
        Cart cart = this.cartRepository.findById(cartId).get();
        Product product = this.productRepository.findById(productId).get();
        return cart.getCartItems().get(product);
    }


    public Cart createCart(Member member){
        Cart cart = new Cart();
        cart.setMember(member);
        return this.cartRepository.save(cart);
    }

    @Transactional
    public void recalculateCartsTotal(){
        List<Cart> carts = this.cartRepository.findAll();
        for (Cart cart : carts) {
            cart.recalculateTotalPrice();
        }
        this.cartRepository.saveAll(carts);
    }

    public void cleanCart(Long cartId) {
        Cart cart = this.cartRepository.findById(cartId).get();
        cart.clearCart();
        this.cartRepository.save(cart);
    }
}
