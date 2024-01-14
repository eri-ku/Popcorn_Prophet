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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.text.ParseException;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/articles")
public class ArticleRestController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<ArticlePageResponse> getArticles(@RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "1") int size) {
        ArticlePageResponse articlePageResponse = ArticlePageResponse.builder()
                .articles(articleService.getArticles(page,size).getContent())
                .totalPages(articleService.getArticles(page,size).getTotalPages())
                .build();
        return ResponseEntity.ok(articlePageResponse);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("id") Long id) throws IOException {



        return ResponseEntity.ok().contentType(MediaType.parseMediaType(articleService.getImageType(id))).body(articleService.getImage(id));

    }

    @GetMapping("/{articleId}")
    public ResponseEntity<Article> getArticle(@PathVariable Long articleId) {
        return ResponseEntity.ok(articleService.getArticle(articleId));
    }

    @PostMapping("/{memberId}")
    public ResponseEntity<Article> addArticle(@PathVariable Long memberId, @ModelAttribute ArticleDTO article, @RequestParam("img") MultipartFile file) throws IOException {

        return new ResponseEntity<>(articleService.addArticle(memberId, article,file), HttpStatus.CREATED);
    }


    @PutMapping("/{articleId}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long articleId, @ModelAttribute ArticleDTO article, @RequestParam(value = "img", required = false) MultipartFile file) throws IOException {
        return ResponseEntity.ok(articleService.updateArticle(articleId, article,file));
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long articleId) throws IOException {
        articleService.deleteArticle(articleId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{articleId}/like")
    public ResponseEntity<Article> likeArticle(@PathVariable Long articleId,@RequestBody boolean isAlreadyLiked){
        articleService.likeArticle(articleId,isAlreadyLiked);
        return ResponseEntity.ok().build();
    }


}
