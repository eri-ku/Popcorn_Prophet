package com.popcorn_prophet.popcorn_prophet.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@NoArgsConstructor
@Component
public class DataInsertion implements CommandLineRunner {
    private ProductRepository productRepository;

    @Autowired
public DataInsertion(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    @Override
    public void run(String... args) throws Exception {
//        ObjectMapper objectMapper = new ObjectMapper();
//
//        File file = new File(getClass().getResource("/insertData.json").getFile());
//        if(!file.exists()){
//            throw new Exception("File not found");
//        }
//        List<Product> products = objectMapper.readValue(file, objectMapper.getTypeFactory().constructCollectionType(List.class, Product.class));
//        productRepository.saveAll(products);


    }
}
