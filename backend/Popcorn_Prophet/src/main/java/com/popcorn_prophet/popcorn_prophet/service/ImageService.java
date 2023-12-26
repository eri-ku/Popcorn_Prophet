package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.ProductImage;
import com.popcorn_prophet.popcorn_prophet.repo.ProductImageRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ImageService {

    private final String PATH="src/main/resources/static/images/";

    private ProductImageRepository productImageRepository;

    @Transactional
    public ProductImage saveImage(MultipartFile file) throws IOException{
        String name = StringUtils.cleanPath(file.getOriginalFilename())+"_"+System.currentTimeMillis();
        ProductImage img = new ProductImage();
        img.setName(name);
        img.setFilePath(PATH+ name);
        img.setType(file.getContentType());
        img = this.productImageRepository.save(img);

        File file1 = new File(PATH + name);

        file.transferTo(file1.toPath());
        return img;


    }

    public ProductImage getImageModel(Long id) throws IOException{
        Optional<ProductImage> img = productImageRepository.findById(id);
        if(img.isEmpty()){
            throw new IOException("Image not found");
        }
        return img.get();
    }

    public byte[] getImage(Long id) throws IOException{
        Optional<ProductImage> img = productImageRepository.findById(id);
        if(img.isEmpty()){
            throw new IOException("Image not found");
        }
        return Files.readAllBytes(new File(img.get().getFilePath()).toPath());
    }

    @Transactional
    public String deleteImage(Long id) throws IOException{
        Optional<ProductImage> img = productImageRepository.findById(id);
        if(img.isEmpty()){
            throw new IOException("Image not found");
        }
        File file = new File(img.get().getFilePath());
        if(file.delete()){
            productImageRepository.deleteById(id);
            return "Image deleted";
        }
        throw new IOException("Image not found");
    }

}
