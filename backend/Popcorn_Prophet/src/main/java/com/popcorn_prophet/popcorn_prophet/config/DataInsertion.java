package com.popcorn_prophet.popcorn_prophet.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.popcorn_prophet.popcorn_prophet.entity.Article;
import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.entity.Product;
import com.popcorn_prophet.popcorn_prophet.entity.Role;
import com.popcorn_prophet.popcorn_prophet.repo.ArticleRepository;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import com.popcorn_prophet.popcorn_prophet.repo.RoleRepository;
import com.popcorn_prophet.popcorn_prophet.rest.MemberRestController;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor

@Component
public class DataInsertion implements CommandLineRunner {
    private final ProductRepository productRepository;
    private final MemberRestController memberRestController;
    private final ArticleRepository articleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;



    @Override
    public void run(String... args) throws Exception {
//        ObjectMapper objectMapper = new ObjectMapper();
//
//        File file = new File(getClass().getResource("/insertProductData.json").getFile());
//        if (!file.exists()) {
//            throw new Exception("File not found");
//        }
//        List<Product> products = objectMapper.readValue(file, objectMapper.getTypeFactory().constructCollectionType(List.class, Product.class));
//        productRepository.saveAll(products);
//        Member member = Member.builder().username("Admin").password("Admin1!").confirmPassword("Admin1!").email("admin@example.com").roles(new HashSet<>()).build();
//        memberRestController.registerMember(member, new org.springframework.validation.BindException(member, "member"));
//
//        articleRepository.save(Article.builder().title("Test article1").content(" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ui aliquam consequatur error nulla vel.").author(member).rating("Good").build());
//        articleRepository.save(Article.builder().title("Test article2").content("Quaerat repellendus, itaque laboriosam neque autem molestiae quam aliquid! Velit,non excepturi!").author(member).rating("Outstanding").build());
//        articleRepository.save(Article.builder().title("Test article3").content("Quaerat repellendus, itaque laboriosam neque autem molestiae quam aliquid! Velit,non excepturi!").author(member).rating("Good").build());
//        articleRepository.save(Article.builder().title("Test article4").content("Quaerat repellendus, itaque laboriosam neque autem molestiae quam aliquid! Velit,non excepturi!").author(member).rating("Bad").build());
//        articleRepository.save(Article.builder().title("Test article5").content("Quaerat repellendus, itaque laboriosam neque autem molestiae quam aliquid! Velit,non excepturi!").author(member).rating("Outstanding").build());

    }
}
