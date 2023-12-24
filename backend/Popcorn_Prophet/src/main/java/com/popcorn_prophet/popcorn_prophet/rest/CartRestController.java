package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.entity.Cart;
import com.popcorn_prophet.popcorn_prophet.entity.CartItem;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.popcorn_prophet.popcorn_prophet.service.CartService;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "*")

@AllArgsConstructor
@RequestMapping("/cart")
public class CartRestController {

    private final CartService cartService;


    @GetMapping({"/{cartId}"})
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartService.getCartItems(cartId).stream().toList());

    }

    @DeleteMapping("/{itemKey}/{cartId}")
    public ResponseEntity<List<CartItem>> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long itemKey) {
        this.cartService.removeItemFromCart(cartId, itemKey);
        return ResponseEntity.ok(cartService.getCartItems(cartId).stream().toList());
    }

    @PostMapping("/{itemKey}/{cartId}")
    public ResponseEntity<List<CartItem>> addItemToCart(@PathVariable Long cartId, @PathVariable Long itemKey) {
        this.cartService.addItemToCart(cartId, itemKey);
        return ResponseEntity.ok(cartService.getCartItems(cartId).stream().toList());
    }

    @PatchMapping("/{itemKey}/{cartId}/{quantity}")
    public ResponseEntity<CartItem> setItemQuantity(@PathVariable Long cartId, @PathVariable Long itemKey,@PathVariable int quantity) {
        this.cartService.setItemQuantity(cartId, itemKey,quantity);
        return ResponseEntity.ok(cartService.getCartItem(cartId,itemKey));
    }


}
