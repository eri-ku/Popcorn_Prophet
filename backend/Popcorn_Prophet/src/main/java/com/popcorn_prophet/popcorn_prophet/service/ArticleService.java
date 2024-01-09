package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.DTO.ArticleDTO;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.ProductReview;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.popcorn_prophet.popcorn_prophet.repo.ArticleRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {


    private final ArticleRepository articleRepository;
    private final MemberRepository memberRepository;

    public Article getArticle(Long articleId) {
        return articleRepository.findById(articleId).get();
    }

    @Transactional
    public Article addArticle(Long memberId, ArticleDTO article) {
        Member member = memberRepository.findById(memberId).get();
        Article newArticle = Article.builder().title(article.getTitle()).
                content(article.getContent()).author(member).rating(article.getRating()).build();
        return articleRepository.save(newArticle);
    }

    @Transactional
    public Article updateArticle(Long articleId, ArticleDTO article) {

        Article updatedArticle = articleRepository.findById(articleId).get();
        updatedArticle.setTitle(article.getTitle());
        updatedArticle.setContent(article.getContent());
        updatedArticle.setRating(article.getRating());
        return articleRepository.save(updatedArticle);

    }

    public void deleteArticle(Long articleId) {
        articleRepository.deleteById(articleId);
    }

    public Page<Article> getArticles(int page, int size) {
        return articleRepository.findAll(PageRequest.of(page, size));
    }

    public void likeArticle(Long articleId, boolean isAlreadyLiked) {
        Article article = articleRepository.findById(articleId).get();
        article.setLikes(isAlreadyLiked? article.getLikes()-1:article.getLikes()+1);
        articleRepository.save(article);
    }
}
