package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.popcorn_prophet.popcorn_prophet.deserializer.DateDeserializer;
import com.popcorn_prophet.popcorn_prophet.deserializer.ListDeserializer;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "product")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Product {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @JsonProperty("title")
    @JsonAlias("Title")
    private String title;
    @Column(nullable = false)
    @JsonProperty("rated")
    @JsonAlias("Rated")
    private String rated;
    @JsonProperty("released")
    @JsonAlias("Released")
    @JsonDeserialize(using = DateDeserializer.class)
    @DateTimeFormat(pattern = "yyyy-MMM-dd")
    private Date released;
    @JsonProperty("runtime")
    @JsonAlias("Runtime")
    private String runtime;
    @ElementCollection
    @JsonProperty("genre")
    @JsonAlias("Genre")
    @JsonDeserialize(using = ListDeserializer.class)
    private List<String> genre;
    @JsonProperty("plot")
    @JsonAlias("Plot")
    @Column(nullable = false)
    private String plot;
    @ElementCollection
    @JsonProperty("language")
    @JsonAlias("Language")
    @JsonDeserialize(using = ListDeserializer.class)
    private List<String> language;
    @JsonProperty("country")
    @JsonAlias("Country")
    @ElementCollection
    @Column(nullable = false)
    @JsonDeserialize(using = ListDeserializer.class)
    private List<String> country;
    @JsonProperty("poster")
    @JsonAlias("Poster")
    private String poster;
    @JsonProperty("type")
    @JsonAlias("Type")
    private String type;


    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "product_image_id", referencedColumnName = "id")
    private Image image;

    @OneToMany(mappedBy = "product",orphanRemoval = true,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CartItem> cartItems;



    @OneToMany(mappedBy = "product",orphanRemoval = true,cascade = CascadeType.ALL)
    @JsonIgnoreProperties("product")
    private List<ProductReview> productReviews;



}
