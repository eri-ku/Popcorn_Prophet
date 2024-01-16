package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.DTO.ArticleCommentDTO;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.entity.ArticleComment;
import com.popcorn_prophet.popcorn_prophet.repo.ArticleCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleCommentService {


    private final ArticleCommentRepository articleCommentRepository;
    private final ArticleService articleService;
    private final MemberService memberService;

    public Page<ArticleComment> getArticleComments(Long articleId, int page) {
        return articleCommentRepository.findAllByArticleId(articleId, PageRequest.of(page, 5));

    }


    public ArticleComment addArticleComment(ArticleCommentDTO articleComment, Long articleId, Long memberId) {
        ArticleComment newArticleComment = ArticleComment.builder()
                .article(articleService.getArticle(articleId)).commentText(articleComment.getCommentText()).member(memberService.getMember(memberId)).build();

        return articleCommentRepository.save(newArticleComment);
    }

    public void deleteArticleComment(Long articleCommentId) {
        articleCommentRepository.deleteById(articleCommentId);
    }

    public ArticleComment getArticleComment(Long articleCommentId) {
        return articleCommentRepository.findById(articleCommentId).get();
    }

    public ArticleComment updateArticleComment(ArticleComment articleComment) {
        return articleCommentRepository.save(articleComment);
    }


    public void likeComment(Long commentId, boolean isAlreadyLiked) {
        ArticleComment articleComment = articleCommentRepository.findById(commentId).get();
        articleComment.setLikes(isAlreadyLiked ? articleComment.getLikes() - 1 : articleComment.getLikes() + 1);
        articleCommentRepository.save(articleComment);
    }


}
