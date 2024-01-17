package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.entity.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.popcorn_prophet.popcorn_prophet.service.CartService;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController

@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartRestController {

    private final CartService cartService;


    @PreAuthorize("@securityService.hasAccessToModifyCart(#cartId)")
    @GetMapping({"/{cartId}"})
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        Optional<Collection<CartItem>> cartItems = cartService.getCartItems(cartId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(cartItems.get().stream().toList());

    }

    @PreAuthorize("@securityService.hasAccessToModifyCart(#cartId)")
    @DeleteMapping("/{itemKey}/{cartId}")
    public ResponseEntity<List<CartItem>> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long itemKey) {
        if (this.cartService.removeItemFromCart(cartId, itemKey).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("@securityService.hasAccessToModifyCart(#cartId)")
    @PostMapping("/{itemKey}/{cartId}")
    public ResponseEntity<List<CartItem>> addItemToCart(@PathVariable Long cartId, @PathVariable Long itemKey) {
        Optional<Boolean> result = this.cartService.addItemToCart(cartId, itemKey);
        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.hasAccessToModifyCart(#cartId)")
    @PatchMapping("/{itemKey}/{cartId}/{quantity}")
    public ResponseEntity<CartItem> setItemQuantity(@PathVariable Long cartId, @PathVariable Long itemKey, @PathVariable int quantity) {
        Optional<Boolean> result = this.cartService.setItemQuantity(cartId, itemKey, quantity);
        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartService.getCartItem(cartId, itemKey).get());
    }


    @PreAuthorize("@securityService.hasAccessToModifyCart(#cartId)")
    @PutMapping("/{cartId}")
    public ResponseEntity<List<CartItem>> cleanCart(@PathVariable Long cartId) {
        Optional<Boolean> result = this.cartService.cleanCart(cartId);
        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return getCartItems(cartId);
    }


}
