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


    @GetMapping({"/{id}"})
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long id) {
        return ResponseEntity.ok(cartService.getCartItems(id).stream().toList());

    }

    @DeleteMapping("/{itemId}/{cartId}")
    public ResponseEntity<List<CartItem>> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        this.cartService.removeItemFromCart(cartId, itemId);
        var list = cartService.getCartItems(cartId).stream().toList();
        return ResponseEntity.ok(cartService.getCartItems(cartId).stream().toList());
    }

    @PostMapping("/{itemId}/{cartId}")
    public ResponseEntity<List<CartItem>> addItemToCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        this.cartService.addItemToCart(cartId, itemId);
        return ResponseEntity.ok(cartService.getCartItems(cartId).stream().toList());
    }


}
