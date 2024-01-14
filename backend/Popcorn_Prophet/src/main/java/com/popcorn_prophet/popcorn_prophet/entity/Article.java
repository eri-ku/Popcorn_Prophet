package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @Lob
    @Column(length = 1000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "author_id",referencedColumnName = "id",nullable = false)
    @JsonIgnoreProperties("memberArticles")
    private Member author;


    private int likes;


    private String rating;
    private String poster;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnoreProperties("article")
    private List<ArticleComment> articleComments;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "article_image_id", referencedColumnName = "id")
    private Image image;






}
