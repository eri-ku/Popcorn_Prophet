package com.popcorn_prophet.popcorn_prophet.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.popcorn_prophet.popcorn_prophet.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class MemberDTO {

    private String email;
    private String password;
}
