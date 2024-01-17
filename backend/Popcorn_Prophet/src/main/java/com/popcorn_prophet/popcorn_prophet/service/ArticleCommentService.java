package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.DTO.ArticleCommentDTO;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.entity.ArticleComment;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.repo.ArticleCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleCommentService {


    private final ArticleCommentRepository articleCommentRepository;
    private final ArticleService articleService;
    private final MemberService memberService;

    public Page<ArticleComment> getArticleComments(Long articleId, int page) {
        return articleCommentRepository.findAllByArticleId(articleId, PageRequest.of(page, 5));

    }


    public Optional<ArticleComment> addArticleComment(ArticleCommentDTO articleComment, Long articleId, Long memberId) {
        Optional<Article> articleOptional = articleService.getArticle(articleId);
        Optional<Member> memberOptional = memberService.getMember(memberId);
        if (articleOptional.isEmpty() || memberOptional.isEmpty()) {
            return Optional.empty();
        }
        Article article = articleOptional.get();
        Member member = memberOptional.get();


        ArticleComment newArticleComment = ArticleComment.builder()
                .article(article).commentText(articleComment.getCommentText()).member(member).build();

        return Optional.of(articleCommentRepository.save(newArticleComment));
    }

    public Optional<Boolean> deleteArticleComment(Long articleCommentId) {
        Optional<ArticleComment> articleCommentOptional = articleCommentRepository.findById(articleCommentId);
        if (articleCommentOptional.isEmpty()) {
            return Optional.empty();
        }
        articleCommentRepository.deleteById(articleCommentId);
        return Optional.of(true);
    }

    public Optional<ArticleComment> getArticleComment(Long articleCommentId) {
        Optional<ArticleComment> articleCommentOptional = articleCommentRepository.findById(articleCommentId);
        if (articleCommentOptional.isEmpty()) {
            return Optional.empty();
        }
        return articleCommentOptional;
    }

    public Optional<ArticleComment> updateArticleComment(ArticleComment articleComment) {
        Optional<ArticleComment> articleCommentOptional = articleCommentRepository.findById(articleComment.getId());
        if (articleCommentOptional.isEmpty()) {
            return Optional.empty();
        }
        ArticleComment articleCommentToEdit = articleCommentOptional.get();
        articleCommentToEdit.setCommentText(articleComment.getCommentText());
        return Optional.of(articleCommentRepository.save(articleCommentToEdit));
    }


    public Optional<ArticleComment> likeComment(Long commentId, String memberName) {
        Optional<ArticleComment> articleCommentOptional = articleCommentRepository.findById(commentId);
        if (articleCommentOptional.isEmpty()) {
            return Optional.empty();
        }
        ArticleComment articleComment = articleCommentOptional.get();
        if (!articleComment.addLikedMemberUsername(memberName)) {
            articleComment.removeLikedMemberUsername(memberName);
        }
        return Optional.of(articleCommentRepository.save(articleComment));
    }




}
