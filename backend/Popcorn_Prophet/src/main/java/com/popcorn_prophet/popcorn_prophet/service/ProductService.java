package com.popcorn_prophet.popcorn_prophet.service;


import com.popcorn_prophet.popcorn_prophet.entity.Image;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ImageService imageService;
    private final CartService cartService;

    @Transactional
    public Optional<Boolean> deleteProduct(Long id) throws IOException {

        Optional<Product> productToDelete = productRepository.findById(id);
        if (productToDelete.isPresent()) {

            if (productToDelete.get().getImage() != null) {
                imageService.deleteImage(productToDelete.get().getImage().getId());
            }
            if(cartService.removeItemFromAllCarts(id).isEmpty()){
                return Optional.empty();
            }
            productRepository.deleteById(id);

            cartService.recalculateCartsTotal();
            return Optional.of(true);
        }
        return Optional.empty();
    }

    public Page<Product> getProducts(int page) {
        return productRepository.findAll(PageRequest.of(page, 5, Sort.by("createdAt").descending()));
    }


    public Optional<Product> getProduct(Long productId) {
        return productRepository.findById(productId);
    }

    @Transactional
    public Product saveOMDBProduct(Product product) {
        return productRepository.save(product);
    }


    @Transactional
    public Product saveProduct(Product product, MultipartFile file) throws IOException {
        Image img = imageService.saveImage(file, "productsImages");
        product.setImage(img);

        String downloadPath = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/products/download/")
                .path(img.getId().toString())
                .toUriString();

        product.setPoster(downloadPath);
        return productRepository.save(product);
    }

    @Transactional
    public Optional<Product> updateProduct(Product product, MultipartFile file) throws IOException {
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
            return Optional.of(productRepository.save(product1));
        }
        return Optional.empty();
    }

}
