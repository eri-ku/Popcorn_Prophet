package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.Image;
import com.popcorn_prophet.popcorn_prophet.repo.ProductImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final String PATH = "src/main/resources/static/images/";

    private final ProductImageRepository productImageRepository;

    @Transactional
    public Image saveImage(MultipartFile file, String folder) throws IOException {
        String finalPath = PATH + folder + "/";
        Path path = Paths.get(finalPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String[] splitName = Objects.requireNonNull(file.getOriginalFilename()).split("\\.");
        String name = StringUtils.cleanPath(splitName[0]) + "_" + System.currentTimeMillis() + "." + splitName[1];
        Image img = new Image();

        img.setName(name);

        img.setFilePath(finalPath + name);
        img.setType(file.getContentType());
        img = this.productImageRepository.save(img);

        File file1 = new File(finalPath + name);

        file.transferTo(file1.toPath());
        return img;


    }

    public Optional<Image> getImageModel(Long id) throws IOException {
        Optional<Image> imgModel = productImageRepository.findById(id);
        if (imgModel.isEmpty()) {
            return Optional.empty();
        }
        return imgModel;
    }

    public byte[] getImage(Long id) throws IOException {
        Optional<Image> img = productImageRepository.findById(id);
        if (img.isEmpty()) {
            return null;
        }
        return Files.readAllBytes(new File(img.get().getFilePath()).toPath());
    }

    @Transactional
    public String deleteImage(Long id) throws IOException {
        Optional<Image> img = productImageRepository.findById(id);
        if (img.isEmpty()) {
            throw new IOException("Image not found");
        }
        File file = new File(img.get().getFilePath());
        if (file.delete()) {
            productImageRepository.deleteById(id);
            return "Image deleted";
        }
        throw new IOException("Image not found");
    }

}
