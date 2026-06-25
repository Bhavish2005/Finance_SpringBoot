package com.pockettrack.backend.config;

import com.pockettrack.backend.ai.RateLimitingInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final RateLimitingInterceptor rateLimitingInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Apply rate limiter to all AI endpoints
        registry.addInterceptor(rateLimitingInterceptor)
                .addPathPatterns("/api/chat/**", "/api/gemini/**");
    }
}
