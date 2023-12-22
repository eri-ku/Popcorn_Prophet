package com.popcorn_prophet.popcorn_prophet.proxy;


import com.popcorn_prophet.popcorn_prophet.entity.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "product-service",url="http://www.omdbapi.com")

public interface ProductProxy {
    @RequestMapping(method= RequestMethod.GET,value = "/" ,produces = "application/json")
            Product getProduct(@RequestParam("apikey") String apiKey, @RequestParam("i") String i);
}
