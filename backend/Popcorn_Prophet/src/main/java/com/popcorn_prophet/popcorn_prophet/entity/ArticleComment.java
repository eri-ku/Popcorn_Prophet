package com.popcorn_prophet.popcorn_prophet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleComment extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Comment cannot be blank")
    @Size(min = 2, max = 255, message = "Comment must be between 2 and 255 characters")
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
