package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.entity.ProductImage;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import com.popcorn_prophet.popcorn_prophet.service.ImageService;
import jakarta.servlet.ServletContext;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.support.ServletContextResource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/products")
public class ProductRestController {
    private final ProductRepository productRepository;
    private final ImageService imageService;


    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {


        return ResponseEntity.ok(productRepository.findAll());
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
    @Transactional
    public ResponseEntity<Product> addProduct(@ModelAttribute Product product, @RequestParam("img") MultipartFile file) throws IOException, ParseException {

        product.setReleasedDate(new Date(new SimpleDateFormat("yyyy-MMM-dd").parse(product.getReleased()).getTime()));

        ProductImage img = imageService.saveImage(file);
        product.setProductImage(img);

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

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<Product> updateProduct(@ModelAttribute Product product, @RequestParam(value = "img",required = false) MultipartFile file) throws IOException, ParseException {
        Optional<Product> productToUpdate = productRepository.findById(product.getId());
        if (productToUpdate.isPresent()) {
            Product product1 = productToUpdate.get();
            if(file!=null) {
                imageService.deleteImage(product1.getProductImage().getId());
                ProductImage img = imageService.saveImage(file);
                product1.setProductImage(img);

                String downloadPath = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/products/download/")
                        .path(img.getId().toString())
                        .toUriString();

                product1.setPoster(downloadPath);
            }
            product1.setReleasedDate(new Date(new SimpleDateFormat("yyyy-MMM-dd").parse(product.getReleased()).getTime()));
            product1.setReleased(product.getReleased());

            product1.setTitle(product.getTitle());
            product1.setRated(product.getRated());
            // product1.setReleased(product.getReleased());
//            product1.setRuntime(product.getRuntime());
            product1.setGenre(product.getGenre());
            product1.setRuntime(product.getRuntime());
//            product1.setDirector(product.getDirector());
//            product1.setWriter(product.getWriter());
//            product1.setActors(product.getActors());
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

    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<Product> deleteProduct(@PathVariable Long id) throws IOException {
        Optional<Product> productToDelete = productRepository.findById(id);
        if (productToDelete.isPresent()) {

            imageService.deleteImage(productToDelete.get().getProductImage().getId());
            productRepository.delete(productToDelete.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
