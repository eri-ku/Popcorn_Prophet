package com.popcorn_prophet.popcorn_prophet.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.popcorn_prophet.popcorn_prophet.entity.*;
import com.popcorn_prophet.popcorn_prophet.repo.ArticleRepository;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import com.popcorn_prophet.popcorn_prophet.repo.ProductRepository;
import com.popcorn_prophet.popcorn_prophet.repo.RoleRepository;
import com.popcorn_prophet.popcorn_prophet.rest.MemberRestController;
import com.popcorn_prophet.popcorn_prophet.service.MemberService;
import com.popcorn_prophet.popcorn_prophet.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
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
    private final ProductService productService;



    @Override
    @Transactional
    public void run(String... args) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        File file = new File(Objects.requireNonNull(getClass().getResource("/insertProductData.json")).getFile());
        if (!file.exists()) {
            throw new Exception("File not found");
        }
        List<Product> products = objectMapper.readValue(file, objectMapper.getTypeFactory().constructCollectionType(List.class, Product.class));

        products.forEach(product -> setAuditData(product));

        productRepository.saveAll(products);
        Member member = Member.builder().username("Admin").password("Admin1!").confirmPassword("Admin1!").email("admin@example.com").roles(new HashSet<>()).build();
     setAuditData(member);
        memberRestController.registerMember(member);
        Member member2 = Member.builder().username("Admin2").password("Admin2!").confirmPassword("Admin2!").email("admin@gmail.com").roles(new HashSet<>()).build();
        setAuditData(member2);
        memberRestController.registerMember(member2);

        file = new File(Objects.requireNonNull(getClass().getResource("/insertArticleData.json")).getFile());
        if (!file.exists()) {
            throw new Exception("File not found");
        }
        List<Article> articles = objectMapper.readValue(file, objectMapper.getTypeFactory().constructCollectionType(List.class, Article.class));
        articles.forEach(article -> {
            article.setAuthor(member);
            setAuditData(article);
        });
        articles.get(0).setAuthor(member2);
        articleRepository.saveAll(articles);
    }
    private void setAuditData(BaseEntity baseEntity) {
        baseEntity.setCreatedAt(LocalDateTime.now());
        baseEntity.setCreatedBy("Admin");
        baseEntity.setUpdatedAt(LocalDateTime.now());
        baseEntity.setUpdatedBy("Admin");
    }
}
