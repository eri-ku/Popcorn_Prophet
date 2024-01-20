package com.popcorn_prophet.popcorn_prophet.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ArticleCommentDTO {
    @NotBlank(message = "Comment cannot be blank")
    @Size(min = 3, max = 255, message = "Comment must be between 3 and 255 characters")
    private String commentText;
}
