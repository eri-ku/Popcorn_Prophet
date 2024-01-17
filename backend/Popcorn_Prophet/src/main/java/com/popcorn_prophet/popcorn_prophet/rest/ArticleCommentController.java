package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.DTO.ArticleCommentDTO;
import com.popcorn_prophet.popcorn_prophet.DTO.ProductReviewCreateDTO;
import com.popcorn_prophet.popcorn_prophet.POJO.ArticlePageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.CommentPageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.ReviewPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.entity.ArticleComment;
import com.popcorn_prophet.popcorn_prophet.entity.ProductReview;
import com.popcorn_prophet.popcorn_prophet.service.ArticleCommentService;
import com.popcorn_prophet.popcorn_prophet.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/articles/articleComment")
public class ArticleCommentController {
    private final ArticleCommentService articleCommentService;

    @GetMapping({"/{articleId}"})
    public ResponseEntity<CommentPageResponse> getArticleComments(@PathVariable Long articleId, @RequestParam(defaultValue = "0") int page) {
        CommentPageResponse commentPageResponse = CommentPageResponse.builder()
                .articleComment(articleCommentService.getArticleComments(articleId, page).getContent())
                .totalPages(articleCommentService.getArticleComments(articleId, page).getTotalPages())
                .build();
        return ResponseEntity.ok(commentPageResponse);
    }

    @PostMapping({"/{articleId}/{memberId}"})
    public ResponseEntity<ArticleComment> addArticleComment(@RequestBody ArticleCommentDTO articleComment, @PathVariable Long articleId, @PathVariable Long memberId) {

        Optional<ArticleComment> articleCommentOptional = articleCommentService.addArticleComment(articleComment, articleId, memberId);
        if (articleCommentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return new ResponseEntity<>(articleCommentOptional.get(), HttpStatus.CREATED);
    }


    @PreAuthorize("@securityService.hasAccessToModifyArticleComment(#articleCommentId) || hasAnyRole('ROLE_ADMIN','ROLE_MODERATOR')")
    @DeleteMapping({"/{articleCommentId}"})
    public ResponseEntity<ArticleComment> deleteArticleComment(@PathVariable Long articleCommentId) {
        Optional<Boolean> isDeleted = articleCommentService.deleteArticleComment(articleCommentId);
        if (isDeleted.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }


    @PreAuthorize("@securityService.hasAccessToModifyArticleComment(#articleComment.id)")
    @PutMapping()
    public ResponseEntity<ArticleComment> updateArticleComment(@RequestBody ArticleComment articleComment) {
        Optional<ArticleComment> articleCommentOptional = articleCommentService.updateArticleComment(articleComment);
        if (articleCommentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(articleCommentOptional.get());
    }


    @PatchMapping("/{commentId}/like")
    public ResponseEntity<ArticleComment> likeComment(@PathVariable Long commentId, @RequestParam String memberName) {
        Optional<ArticleComment> articleCommentOptional = articleCommentService.likeComment(commentId, memberName);
        if (articleCommentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(articleCommentOptional.get());
    }


}
