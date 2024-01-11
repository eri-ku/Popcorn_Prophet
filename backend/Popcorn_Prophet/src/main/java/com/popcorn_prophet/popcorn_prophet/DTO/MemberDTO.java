package com.popcorn_prophet.popcorn_prophet.DTO;

import com.popcorn_prophet.popcorn_prophet.entity.Role;

import java.util.Set;

public class MemberDTO {

    private Long id;
   private  String username;
  private  String email;
    private Set<Role> roles;
}
