package com.popcorn_prophet.popcorn_prophet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.popcorn_prophet.popcorn_prophet.proxy")
public class PopcornProphetApplication {

    public static void main(String[] args) {
        SpringApplication.run(PopcornProphetApplication.class, args);
    }

}
