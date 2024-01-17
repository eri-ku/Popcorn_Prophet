package com.popcorn_prophet.popcorn_prophet.rest;


import com.popcorn_prophet.popcorn_prophet.DTO.ArticleDTO;
import com.popcorn_prophet.popcorn_prophet.POJO.ArticlePageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.ProductPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.entity.Image;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.service.ArticleService;
import com.popcorn_prophet.popcorn_prophet.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.text.ParseException;
import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/articles")
public class ArticleRestController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<ArticlePageResponse> getArticles(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "1") int size) {
        ArticlePageResponse articlePageResponse = ArticlePageResponse.builder()
                .articles(articleService.getArticles(page, size).getContent())
                .totalPages(articleService.getArticles(page, size).getTotalPages())
                .build();
        return ResponseEntity.ok(articlePageResponse);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("id") Long id) throws IOException {
        String imgType = articleService.getImageType(id);
        byte[] image = articleService.getImage(id);
        if (Objects.isNull(imgType) || Objects.isNull(image)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(imgType)).body(image);

    }

    @GetMapping("/{articleId}")
    public ResponseEntity<Article> getArticle(@PathVariable Long articleId) {
        Optional<Article> article = articleService.getArticle(articleId);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(article.get());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @PostMapping("/{memberId}")
    public ResponseEntity<Article> addArticle(@PathVariable Long memberId, @ModelAttribute ArticleDTO article, @RequestParam("img") MultipartFile file) throws IOException {

        Optional<Article> newArticle = articleService.addArticle(memberId, article, file);
        if (newArticle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return new ResponseEntity<>(newArticle.get(), HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.hasAccessToModifyArticle(#articleId)")
    @PutMapping("/{articleId}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long articleId, @ModelAttribute ArticleDTO article, @RequestParam(value = "img", required = false) MultipartFile file) throws IOException {
        Optional<Article> articleToUpdate = articleService.updateArticle(articleId, article, file);
        if (articleToUpdate.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(articleToUpdate.get());
    }

    @PreAuthorize("@securityService.hasAccessToModifyArticle(#articleId) || hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long articleId) throws IOException {
        Optional<Boolean> article = articleService.deleteArticle(articleId);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/{articleId}/like")
    public ResponseEntity<Article> likeArticle(@PathVariable Long articleId, @RequestParam String memberName) {
        Optional<Article> article = articleService.likeArticle(articleId, memberName);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(article.get());
    }


}
