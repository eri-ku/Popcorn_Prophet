package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.DTO.ArticleDTO;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.entity.Image;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.popcorn_prophet.popcorn_prophet.repo.ArticleRepository;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {


    private final ArticleRepository articleRepository;
    private final MemberRepository memberRepository;
    private final ImageService imageService;

    public Article getArticle(Long articleId) {
        return articleRepository.findById(articleId).get();
    }

    @Transactional
    public Article addArticle(Long memberId, ArticleDTO article, MultipartFile file) throws IOException {
        Member member = memberRepository.findById(memberId).get();
        Image img = imageService.saveImage(file, "articlesImages");
        String downloadPath = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/articles/download/")
                .path(img.getId().toString())
                .toUriString();

        Article newArticle = Article.builder().title(article.getTitle()).
                content(article.getContent()).author(member).rating(article.getRating()).image(img).poster(downloadPath).build();
        return articleRepository.save(newArticle);
    }


    @Transactional
    public Article save(Article article) {
        return articleRepository.save(article);
    }

    @Transactional
    public Article updateArticle(Long articleId, ArticleDTO article, MultipartFile file) throws IOException {


        Article updatedArticle = articleRepository.findById(articleId).get();
        if (file != null) {
            if (updatedArticle.getImage() != null) {
                imageService.deleteImage(updatedArticle.getImage().getId());
            }
            Image img = imageService.saveImage(file, "articlesImages");
            updatedArticle.setImage(img);

            String downloadPath = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/articles/download/")
                    .path(img.getId().toString())
                    .toUriString();

            updatedArticle.setPoster(downloadPath);
        }
        updatedArticle.setTitle(article.getTitle());
        updatedArticle.setContent(article.getContent());
        updatedArticle.setRating(article.getRating());
        return articleRepository.save(updatedArticle);

    }

    public void deleteArticle(Long articleId) throws IOException {

        Optional<Article> articleToDelete = articleRepository.findById(articleId);
        if (articleToDelete.isPresent()) {

            if (articleToDelete.get().getImage() != null) {
                imageService.deleteImage(articleToDelete.get().getImage().getId());
            }
            articleRepository.deleteById(articleId);


        }
    }

    public Page<Article> getArticles(int page, int size) {
        return articleRepository.findAll(PageRequest.of(page, size));
    }

    public void likeArticle(Long articleId, boolean isAlreadyLiked) {
        Article article = articleRepository.findById(articleId).get();
        article.setLikes(isAlreadyLiked ? article.getLikes() - 1 : article.getLikes() + 1);
        articleRepository.save(article);
    }

    public byte[] getImage(Long id) throws IOException {
        return imageService.getImage(id);
    }

    public String getImageType(Long id) throws IOException {
        return imageService.getImageModel(id).getType();
    }


}
