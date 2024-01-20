package com.popcorn_prophet.popcorn_prophet.service;

import com.popcorn_prophet.popcorn_prophet.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final ProductReviewService productReviewService;
    private final ArticleCommentService articleCommentService;
    private final ArticleService articleService;
    private final MemberService memberService;

    public boolean hasAccessToModifyProductReview(Long productReviewId) {
        Optional<ProductReview> optionalProductReview = productReviewService.getProductReview(productReviewId);
        if (optionalProductReview.isEmpty()) {
            return false;
        }
        ProductReview productReview = optionalProductReview.get();
        return SecurityContextHolder.getContext().getAuthentication().getName().equals(productReview.getMember().getEmail());

    }

    public boolean hasAccessToModifyArticleComment(Long articleCommentId) {
        Optional<ArticleComment> optionalArticleComment = articleCommentService.getArticleComment(articleCommentId);
        if (optionalArticleComment.isEmpty()) {
            return false;
        }
        ArticleComment articleComment = optionalArticleComment.get();
        return SecurityContextHolder.getContext().getAuthentication().getName().equals(articleComment.getMember().getEmail());
    }

    public boolean hasAccessToModifyArticle(Long articleId) {
        Optional<Article> optionalArticle = articleService.getArticle(articleId);
        if (optionalArticle.isEmpty()) {
            return false;
        }
        Article article = optionalArticle.get();
        return SecurityContextHolder.getContext().getAuthentication().getName().equals(article.getAuthor().getEmail());

    }

    public boolean hasAccessToModifyBillingInfo(Long billingInfoId) {
        Optional<Member> optionalMember = memberService.getMemberByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (optionalMember.isEmpty()) {
            return false;
        }
        Member member = optionalMember.get();

        return member.getBillingInfo().getId().equals(billingInfoId);
    }

    public boolean hasAccessToModifyCart(Long cartId) {
        Optional<Member> optionalMember = memberService.getMemberByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (optionalMember.isEmpty()) {
            return false;
        }
        Member member = optionalMember.get();
        return member.getCart().getId().equals(cartId);
    }

    public boolean hasAccessToModifyMember(Long memberId) {
        Optional<Member> optionalMember = memberService.getMemberByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (optionalMember.isEmpty()) {
            return false;
        }
        Member member = optionalMember.get();
        return member.getId().equals(memberId);
    }


}
