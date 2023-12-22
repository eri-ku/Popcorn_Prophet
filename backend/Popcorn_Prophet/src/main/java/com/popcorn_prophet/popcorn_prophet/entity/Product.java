package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.popcorn_prophet.popcorn_prophet.deserializer.DateDeserializer;
import com.popcorn_prophet.popcorn_prophet.deserializer.ListDeserializer;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product")
@JsonIgnoreProperties(ignoreUnknown = true)

public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @JsonProperty("title")
    @JsonAlias("Title")
    private String title;
    private double price;
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


    @OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "product_image_id", referencedColumnName = "id")
    private ProductImage productImage;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CartItem> cartItems;


}
