package com.popcorn_prophet.popcorn_prophet.rest;

import com.popcorn_prophet.popcorn_prophet.DTO.ArticleCommentDTO;
import com.popcorn_prophet.popcorn_prophet.DTO.ProductReviewCreateDTO;
import com.popcorn_prophet.popcorn_prophet.POJO.ArticlePageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.CommentPageResponse;
import com.popcorn_prophet.popcorn_prophet.POJO.ReviewPageResponse;
import com.popcorn_prophet.popcorn_prophet.entity.ArticleComment;
import com.popcorn_prophet.popcorn_prophet.entity.ProductReview;
import com.popcorn_prophet.popcorn_prophet.service.ArticleCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/articles/articleComment")
public class ArticleCommentController {
    private final ArticleCommentService articleCommentService;

    @GetMapping({"/{articleId}"})
    public ResponseEntity<CommentPageResponse> getArticleComments(@PathVariable Long articleId, @RequestParam(defaultValue = "0") int page) {
        CommentPageResponse commentPageResponse =  CommentPageResponse.builder()
                .articleComment(articleCommentService.getArticleComments(articleId,page).getContent())
                .totalPages(articleCommentService.getArticleComments(articleId,page).getTotalPages())
                .build();
        return ResponseEntity.ok(commentPageResponse);
    }



    @PostMapping({"/{articleId}/{memberId}"})
    public ResponseEntity<ArticleComment> addArticleComment(@RequestBody ArticleCommentDTO articleComment, @PathVariable Long articleId, @PathVariable Long memberId){

        return ResponseEntity.ok(articleCommentService.addArticleComment(articleComment,articleId,memberId));
    }
    @DeleteMapping({"/{articleCommentId}"})
    public ResponseEntity<ArticleComment> deleteArticleComment(@PathVariable Long articleCommentId){
        articleCommentService.deleteArticleComment(articleCommentId);
        return ResponseEntity.ok().build();
    }

    @PutMapping()
    public ResponseEntity<ArticleComment> updateArticleComment(@RequestBody ArticleComment articleComment){
        ArticleComment articleCommentToEdit = articleCommentService.getArticleComment(articleComment.getId());
        articleCommentToEdit.setCommentText(articleComment.getCommentText());
        return ResponseEntity.ok(articleCommentService.updateArticleComment(articleCommentToEdit));
    }

}
