package com.popcorn_prophet.popcorn_prophet.config;

import com.popcorn_prophet.popcorn_prophet.entity.Member;
import com.popcorn_prophet.popcorn_prophet.repo.MemberRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@AllArgsConstructor
@Component
public class PopcornProphetAuthenticationProvider implements AuthenticationProvider {
    private MemberRepository memberRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = authentication.getCredentials()
                .toString();
        Member member = memberRepository.findByEmail(email).orElseThrow(() -> new BadCredentialsException("User not found"));
        if(passwordEncoder.matches(password, member.getPassword())){
            return new UsernamePasswordAuthenticationToken(email, password, member.getRoles());
        } else {
            throw new BadCredentialsException("Wrong password");
        }
    }



    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
