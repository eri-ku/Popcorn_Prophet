package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String commentText;
    private int likes;

    @ManyToOne()
    @JsonIgnoreProperties("memberArticleComments")
//http://springquay.blogspot.com/2016/01/new-approach-to-solve-json-recursive.html
    @JoinColumn(name = "member_id",referencedColumnName = "id",nullable = false)
    private Member member;

    @ManyToOne()
    @JsonIgnoreProperties("articleComments")
    @JoinColumn(name = "article_id",referencedColumnName = "id",nullable = false)
    private Article article;

}
