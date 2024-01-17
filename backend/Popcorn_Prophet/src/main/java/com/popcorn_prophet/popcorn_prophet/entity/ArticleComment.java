package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String commentText;
    private int likes;

    @ElementCollection
    private List<String> likedMembersUsernames;




    @ManyToOne()
    @JsonIgnoreProperties("memberArticleComments")
//http://springquay.blogspot.com/2016/01/new-approach-to-solve-json-recursive.html
    @JoinColumn(name = "member_id",referencedColumnName = "id",nullable = false)
    private Member member;

    @ManyToOne()
    @JsonIgnoreProperties("articleComments")
    @JsonIgnore
    @JoinColumn(name = "article_id",referencedColumnName = "id",nullable = false)
    private Article article;


    public boolean addLikedMemberUsername(String username) {
        if (this.likedMembersUsernames.contains(username)) {
            return false;
        }
        this.setLikes(this.getLikes() + 1);
        this.likedMembersUsernames.add(username);
        return true;
    }

    public void removeLikedMemberUsername(String username) {
        this.likedMembersUsernames.remove(username);
        this.setLikes(this.getLikes() - 1);
    }
}
