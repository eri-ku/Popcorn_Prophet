package com.popcorn_prophet.popcorn_prophet.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.bind.annotation.CrossOrigin;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product")

public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String rated;
    @Column(nullable = false)
    private String released;
    @Column(nullable = false)
    private String runtime;
    @Column(nullable = false)
    private String genre;
    @Column(nullable = false)
    private String director;
    @Column(nullable = false)
    private String writer;
    @Column(nullable = false)
    private String actors;
    @Column(nullable = false)
    private String plot;
    @Column(nullable = false)
    private String language;
    @Column(nullable = false)
    private String country;
    @Column(nullable = false)
    private String poster;
    @Column(nullable = false)
    private String type;
}
