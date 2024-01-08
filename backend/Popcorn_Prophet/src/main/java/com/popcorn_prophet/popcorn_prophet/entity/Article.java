package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

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





}
