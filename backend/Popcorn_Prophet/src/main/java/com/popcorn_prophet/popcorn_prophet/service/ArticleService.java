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
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.popcorn_prophet.popcorn_prophet.repo.ArticleRepository;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {


    private final ArticleRepository articleRepository;
    private final MemberRepository memberRepository;
    private final ImageService imageService;

    public Optional<Article> getArticle(Long articleId) {
        Optional<Article> article = articleRepository.findById(articleId);
        if (article.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(articleRepository.findById(articleId).get());
    }

    @Transactional
    public Optional<Article> addArticle(Long memberId, ArticleDTO article, MultipartFile file) throws IOException {
        Optional<Member> member = memberRepository.findById(memberId);
        if (member.isEmpty()) {
            return Optional.empty();
        }
        Image img = imageService.saveImage(file, "articlesImages");
        String downloadPath = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/articles/download/")
                .path(img.getId().toString())
                .toUriString();

        Article newArticle = Article.builder().title(article.getTitle()).
                content(article.getContent()).author(member.get()).rating(article.getRating()).image(img).poster(downloadPath).build();
        return Optional.of(articleRepository.save(newArticle));
    }


    @Transactional
    public Optional<Article> updateArticle(Long articleId, ArticleDTO article, MultipartFile file) throws IOException {

        Optional<Article> articleToUpdate = articleRepository.findById(articleId);
        if (articleToUpdate.isEmpty()) {
            return Optional.empty();
        }
        Article updatedArticle = articleToUpdate.get();

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
        return Optional.of(articleRepository.save(updatedArticle));

    }

    @Transactional
    public Optional<Boolean> deleteArticle(Long articleId) throws IOException {

        Optional<Article> articleToDelete = articleRepository.findById(articleId);
        if (articleToDelete.isEmpty()) {
            return Optional.empty();
        }
        if (articleToDelete.get().getImage() != null) {
            imageService.deleteImage(articleToDelete.get().getImage().getId());
        }
        articleRepository.deleteById(articleId);
        return Optional.of(true);


    }


    public Page<Article> getArticles(int page, int size) {
        return articleRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @Transactional
    public Optional<Article> likeArticle(Long articleId, String memberName) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        if (articleOptional.isEmpty()) {
            return Optional.empty();
        }
        Article article = articleOptional.get();
        if (!article.addLikedMemberUsername(memberName)) {
            article.removeLikedMemberUsername(memberName);
        }
        return Optional.of(articleRepository.save(article));
    }

    public byte[] getImage(Long id) throws IOException {
        byte[] image = imageService.getImage(id);
        if (Objects.isNull(image)) {
            return null;
        }

        return imageService.getImage(id);
    }

    public String getImageType(Long id) throws IOException {
        Optional<Image> imageOptional = imageService.getImageModel(id);
        if (imageOptional.isEmpty()) {
            return null;
        }
        return imageOptional.get().getType();
    }


}
