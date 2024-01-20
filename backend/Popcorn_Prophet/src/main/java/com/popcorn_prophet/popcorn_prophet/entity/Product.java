package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.popcorn_prophet.popcorn_prophet.deserializer.DateDeserializer;
import com.popcorn_prophet.popcorn_prophet.deserializer.ListDeserializer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @JsonProperty("title")
    @JsonAlias("Title")
    @NotBlank(message = "Title is mandatory")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @JsonProperty("plot")
    @JsonAlias("Plot")
    @NotBlank(message = "Plot is mandatory")
    @Size(min = 3, max = 255, message = "Plot must be between 3 and 255 characters")
    private String plot;

    @JsonProperty("rated")
    @JsonAlias("Rated")
    @NotBlank(message = "Rated is mandatory")
    private String rated;

    @JsonProperty("released")
    @JsonAlias("Released")
    @JsonDeserialize(using = DateDeserializer.class)
    @DateTimeFormat(pattern = "yyyy-MMM-dd")
    private Date released;

    @JsonProperty("runtime")
    @JsonAlias("Runtime")
    @NotBlank(message = "Runtime is mandatory")
    //Problem with OMDB , sometimes random characters are added to runtime
    //@Pattern(regexp = "^[0-9]+(\\s*min)?$|^N/A$", message = "Runtime must be in format: 123 min")
    private String runtime;

    @ElementCollection
    @JsonProperty("genre")
    @JsonAlias("Genre")
    @JsonDeserialize(using = ListDeserializer.class)
    private List<String> genre;

    @ElementCollection
    @JsonProperty("language")
    @JsonAlias("Language")
    @JsonDeserialize(using = ListDeserializer.class)
    private List<String> language;

    @JsonProperty("country")
    @JsonAlias("Country")
    @ElementCollection
    @JsonDeserialize(using = ListDeserializer.class)
    private List<String> country;

    @JsonProperty("poster")
    @JsonAlias("Poster")
    private String poster;

    @JsonProperty("type")
    @JsonAlias("Type")
    @NotBlank(message = "Type is mandatory")
    private String type;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "product_image_id", referencedColumnName = "id")
    private Image image;

    @OneToMany(mappedBy = "product", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "product", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("product")
    private List<ProductReview> productReviews;
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
}
