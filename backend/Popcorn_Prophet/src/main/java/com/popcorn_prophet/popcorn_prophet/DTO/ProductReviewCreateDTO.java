package com.popcorn_prophet.popcorn_prophet.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductReviewCreateDTO {
    @NotBlank(message = "Review cannot be blank")
    @Size(min = 2, max = 255, message = "Review must be between 2 and 255 characters")
    private String review;

    @NotBlank(message = "Rating cannot be blank")
    @Pattern(regexp = "^(0(\\.[05])?|([1-4](\\.[05])?)|5(\\.0)?)$", message = "Rating must be between 0.0 and 5.0, only increments of 0.5 are allowed")
    private String rating;

}
