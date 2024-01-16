package com.popcorn_prophet.popcorn_prophet.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.popcorn_prophet.popcorn_prophet.POJO.ProductPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.entity.Image;
import com.popcorn_prophet.popcorn_prophet.proxy.ProductProxy;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import com.popcorn_prophet.popcorn_prophet.service.CartService;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.text.ParseException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductRestController {
    private final ProductRepository productRepository;
    private final ImageService imageService;
    private final ProductProxy productProxy;
    private final CartService cartService;
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
        Product product = productProxy.getProduct("6b9ab58", i);
        if (product != null) {
            product.setRuntime(product.getRuntime().split(" ")[0]);
            return ResponseEntity.ok(productRepository.save(product));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @Transactional
    public ResponseEntity<Product> addProduct(@ModelAttribute Product product, @RequestParam("img") MultipartFile file) throws IOException, ParseException {


        Image img = imageService.saveImage(file, "productsImages");
        product.setImage(img);

        String downloadPath = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/products/download/")
                .path(img.getId().toString())
                .toUriString();

        product.setPoster(downloadPath);


        return new ResponseEntity<>(productRepository.save(product), HttpStatus.CREATED);
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("id") Long id) throws IOException {
        byte[] image = imageService.getImage(id);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(imageService.getImageModel(id).getType())).body(image);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @PutMapping("/update")
    @Transactional
    public ResponseEntity<Product> updateProduct(@ModelAttribute Product product, @RequestParam(value = "img", required = false) MultipartFile file) throws IOException, ParseException {
        Optional<Product> productToUpdate = productRepository.findById(product.getId());
        if (productToUpdate.isPresent()) {
            Product product1 = productToUpdate.get();
            if (file != null) {
                if (product1.getImage() != null) {
                    imageService.deleteImage(product1.getImage().getId());
                }
                Image img = imageService.saveImage(file, "productsImages");
                product1.setImage(img);

                String downloadPath = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/products/download/")
                        .path(img.getId().toString())
                        .toUriString();

                product1.setPoster(downloadPath);
            }
            product1.setReleased(product.getReleased());

            product1.setTitle(product.getTitle());
            product1.setRated(product.getRated());
            product1.setGenre(product.getGenre());
            product1.setRuntime(product.getRuntime());
            product1.setPlot(product.getPlot());
            product1.setLanguage(product.getLanguage());
            product1.setCountry(product.getCountry());
            product1.setType(product.getType());


            productRepository.save(product1);
            return ResponseEntity.ok(product1);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable Long id) throws IOException {
        Optional<Product> productToDelete = productRepository.findById(id);
        if (productToDelete.isPresent()) {

            if (productToDelete.get().getImage() != null) {
                imageService.deleteImage(productToDelete.get().getImage().getId());
            }
            productService.deleteProduct(productToDelete.get().getId());
            cartService.recalculateCartsTotal();
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
