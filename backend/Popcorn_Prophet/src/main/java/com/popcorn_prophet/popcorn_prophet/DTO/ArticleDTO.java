package com.popcorn_prophet.popcorn_prophet.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleDTO {

    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Content is mandatory")
    @Size(min = 3, max = 1000, message = "Content must be between 3 and 1000 characters")
    private String content;

    @NotBlank(message = "Rating cannot be blank")
    private String rating;


}
