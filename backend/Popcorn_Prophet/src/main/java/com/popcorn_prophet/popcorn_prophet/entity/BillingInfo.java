package com.popcorn_prophet.popcorn_prophet.entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter

@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)

public class BillingInfo extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String postalCode;
    private String address;
    private String city;
    private String country;
    private String paymentMethod;
}
