package com.popcorn_prophet.popcorn_prophet.POJO;

import com.popcorn_prophet.popcorn_prophet.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class MemberResponse {
    private String message;
    private Member member;
    private Long cartId;
    private List<String> errors;;

}
