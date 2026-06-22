package com.pockettrack.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Defines the prefix for topics where the backend will push messages to the frontend
        config.enableSimpleBroker("/topic");
        // Defines the prefix for messages sent FROM the frontend TO the backend
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The frontend will connect to this exact endpoint to establish the live socket
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // In production, restrict this to your Vercel URL
                .withSockJS(); // Fallback for browsers that don't support raw WebSockets
    }
}