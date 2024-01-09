package com.popcorn_prophet.popcorn_prophet.repo;

import com.popcorn_prophet.popcorn_prophet.entity.ArticleComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleCommentRepository extends JpaRepository<ArticleComment, Long> {

    @Query("select ac from ArticleComment ac where ac.article.id = :articleId")
    Page<ArticleComment> findAllByArticleId(Long articleId, PageRequest of);
}
