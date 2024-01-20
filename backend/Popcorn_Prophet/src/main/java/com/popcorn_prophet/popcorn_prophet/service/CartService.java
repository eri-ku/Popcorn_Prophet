package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.CartItem;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.CartRepository;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.popcorn_prophet.popcorn_prophet.entity.Cart;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;



    @Transactional
    public Optional<Boolean> addItemToCart(Long cartId, Long productId) {
        Optional<Cart> cartOptional = this.cartRepository.findById(cartId);
        Optional<Product> productOptional = this.productRepository.findById(productId);
        if (cartOptional.isEmpty() || productOptional.isEmpty()) {
            return Optional.empty();
        }
        Cart cart = cartOptional.get();
        cart.addItem(productOptional.get());
        this.cartRepository.save(cart);
        return Optional.of(true);
    }

    @Transactional
    public Optional<Boolean> removeItemFromCart(Long cartId, Long productId) {
        Optional<Product> productOptional = this.productRepository.findById(productId);
        Optional<Cart> cartOptional = this.cartRepository.findById(cartId);
        if (cartOptional.isEmpty() || productOptional.isEmpty()) {
            return Optional.empty();
        }
        Cart cart = cartOptional.get();
        cart.removeItem(productOptional.get());
        this.cartRepository.save(cart);
        return Optional.of(true);
    }



    public Optional<Collection<CartItem>> getCartItems(Long id) {
        Optional <Cart> cartOptional = this.cartRepository.findById(id);
        if (cartOptional.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(cartOptional.get().getCartItems().values());

    }


    @Transactional
    public Optional<Boolean> setItemQuantity(Long cartId, Long productId, int quantity) {
        Optional<Cart> cartOptional = this.cartRepository.findById(cartId);
        Optional<Product> productOptional = this.productRepository.findById(productId);
        if (cartOptional.isEmpty() || productOptional.isEmpty()) {
            return Optional.empty();
        }
        Cart cart = cartOptional.get();
        Product product = productOptional.get();
        cart.changeQuantity(product, quantity);
        this.cartRepository.save(cart);
        return Optional.of(true);
    }

    public Optional<CartItem> getCartItem(Long cartId, Long productId) {
        Optional<Cart> cartOptional = this.cartRepository.findById(cartId);
        Optional<Product> productOptional = this.productRepository.findById(productId);
        if (cartOptional.isEmpty() || productOptional.isEmpty()) {
            return Optional.empty();
        }

        Cart cart = this.cartRepository.findById(cartId).get();
        Product product = this.productRepository.findById(productId).get();
        return Optional.ofNullable(cart.getCartItems().get(product));
    }

    @Transactional

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

    @Transactional
    public Optional<Boolean> cleanCart(Long cartId) {
        Optional<Cart> cartOptional = this.cartRepository.findById(cartId);
        if (cartOptional.isEmpty()) {
            return Optional.empty();
        }
        Cart cart = cartOptional.get();
        cart.clearCart();
        this.cartRepository.save(cart);
        return Optional.of(true);
    }
}
