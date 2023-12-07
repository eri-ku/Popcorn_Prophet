package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/products")
public class ProductRestController {
    private final ProductRepository productRepository;


    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {
        return  ResponseEntity.ok(productRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        System.out.println(product);
        return new ResponseEntity<>(productRepository.save(product), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Product> updateProduct(@RequestBody Product product) {
        Optional<Product> productToUpdate = productRepository.findById(product.getId());
        if (productToUpdate.isPresent()) {
            Product product1 = productToUpdate.get();
            product1.setTitle(product.getTitle());
            product1.setRated(product.getRated());
            product1.setReleased(product.getReleased());
            product1.setRuntime(product.getRuntime());
            product1.setGenre(product.getGenre());
            product1.setDirector(product.getDirector());
            product1.setWriter(product.getWriter());
            product1.setActors(product.getActors());
            product1.setPlot(product.getPlot());
            product1.setLanguage(product.getLanguage());
            product1.setCountry(product.getCountry());
            product1.setPoster(product.getPoster());
            product1.setType(product.getType());
            productRepository.save(product1);
            return ResponseEntity.ok(product1);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Product> deleteProduct( @PathVariable Long id) {
        Optional<Product> productToDelete = productRepository.findById(id);
        if (productToDelete.isPresent()) {
            productRepository.delete(productToDelete.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
