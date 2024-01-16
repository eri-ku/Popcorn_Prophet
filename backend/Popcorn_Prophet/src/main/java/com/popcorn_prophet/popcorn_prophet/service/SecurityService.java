package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final ProductReviewService productReviewService;
    private final ArticleCommentService articleCommentService;
    private final ArticleService articleService;
    private final MemberService memberService;
    private final ProductService productService;
    public boolean hasAccessToModifyProductReview(Long productReviewId){
        ProductReview productReview = productReviewService.getProductReview(productReviewId);
        return SecurityContextHolder.getContext().getAuthentication().getName().equals(productReview.getMember().getEmail());

    }
    public boolean hasAccessToModifyArticleComment(Long articleCommentId){
        ArticleComment articleComment = articleCommentService.getArticleComment(articleCommentId);
        return SecurityContextHolder.getContext().getAuthentication().getName().equals(articleComment.getMember().getEmail());
    }

    public boolean hasAccessToModifyArticle(Long articleId){
        Article article = articleService.getArticle(articleId);
        return SecurityContextHolder.getContext().getAuthentication().getName().equals(article.getAuthor().getEmail());

    }
    public boolean hasAccessToModifyBillingInfo(Long billingInfoId){
        Member member = memberService.getMemberByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        return member.getBillingInfo().getId().equals(billingInfoId);
    }
    public boolean hasAccessToModifyCart(Long cartId){
        Member member = memberService.getMemberByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        return member.getCart().getId().equals(cartId);
    }
    public boolean hasAccessToModifyMember(Long memberId){
        Member member = memberService.getMemberByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        return member.getId().equals(memberId);
    }

}
