package com.popcorn_prophet.popcorn_prophet.rest;


import com.popcorn_prophet.popcorn_prophet.DTO.ArticleDTO;
import com.popcorn_prophet.popcorn_prophet.POJO.ArticlePageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.ProductPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{articleId}")
    public ResponseEntity<Article> getArticle(@PathVariable Long articleId) {
        return ResponseEntity.ok(articleService.getArticle(articleId));
    }

    @PostMapping("/{memberId}")
    public ResponseEntity<Article> addArticle(@PathVariable Long memberId, @RequestBody ArticleDTO article) {
        return ResponseEntity.ok(articleService.addArticle(memberId, article));
    }

    @PutMapping("/{articleId}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long articleId, @RequestBody ArticleDTO article) {
        return ResponseEntity.ok(articleService.updateArticle(articleId, article));
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long articleId) {
        articleService.deleteArticle(articleId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{articleId}/like")
    public ResponseEntity<Article> likeArticle(@PathVariable Long articleId,@RequestBody boolean isAlreadyLiked){
        articleService.likeArticle(articleId,isAlreadyLiked);
        return ResponseEntity.ok().build();
    }


}
