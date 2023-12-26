package com.popcorn_prophet.popcorn_prophet.POJO;

import com.popcorn_prophet.popcorn_prophet.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductPageResponse {
    private int totalPages;
    private List<Product> products;
}
