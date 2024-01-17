package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.POJO.ProductPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.Image;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.proxy.ProductProxy;
import com.popcorn_prophet.popcorn_prophet.service.ImageService;
import com.popcorn_prophet.popcorn_prophet.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductRestController {
    private final ImageService imageService;
    private final ProductProxy productProxy;
    private final ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<ProductPageResponse> getProducts(@RequestParam(defaultValue = "0") int page) {
        ProductPageResponse productPageResponse = ProductPageResponse.builder()
                .products(productService.productPagination(page).getContent())
                .totalPages(productService.productPagination(page).getTotalPages())
                .build();
        return ResponseEntity.ok(productPageResponse);
    }

    @PostMapping("/search")
    public ResponseEntity<Product> searchProducts(@RequestParam("i") String i) {
        Optional<Product> product = productProxy.getProduct("6b9ab58", i);
        if (product.isPresent()) {
            Product newProduct = product.get();
            newProduct.setRuntime(newProduct.getRuntime().split(" ")[0]);
            return new ResponseEntity<>(productService.saveOMDBProduct(newProduct), HttpStatus.CREATED);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Optional<Product> product = productService.getProduct(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    public ResponseEntity<Product> addProduct(@ModelAttribute Product product, @RequestParam("img") MultipartFile file) throws IOException, ParseException {

        return new ResponseEntity<>(productService.saveProduct(product, file), HttpStatus.CREATED);
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("id") Long id) throws IOException {
        byte[] image = imageService.getImage(id);

        Optional<Image> imageModelOptional = imageService.getImageModel(id);
        if (Objects.isNull(image) || imageModelOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Image imageModel = imageModelOptional.get();

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(imageModel.getType())).body(image);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @PutMapping("/update")
    public ResponseEntity<Product> updateProduct(@ModelAttribute Product product, @RequestParam(value = "img", required = false) MultipartFile file) throws IOException, ParseException {

        Optional<Product> updatedProduct = this.productService.updateProduct(product, file);
        if (updatedProduct.isPresent()) {
            return ResponseEntity.ok(updatedProduct.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) throws IOException {
        Optional<Boolean> isDeleted = productService.deleteProduct(id);
        if (isDeleted.isPresent()) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
