package com.popcorn_prophet.popcorn_prophet.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class MemberResponse {
    private String message;
    private Member member;
    private List<String> errors;;

}
