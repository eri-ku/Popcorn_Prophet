package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.List;


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
    @Transient
    private String released;
    private Date releasedDate;
    private String runtime;
    @ElementCollection
    private List<String> genre;
    @Column(nullable = false)
    private String plot;
    @ElementCollection
    private List<String> language;
    @Column(nullable = false)
    private String country;
    private String poster;
    private String type;

    @OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL, targetEntity = ProductImage.class)
    @JsonIgnore
    @JoinColumn(name = "product_image_id", referencedColumnName = "id")
    private ProductImage productImage;
}
