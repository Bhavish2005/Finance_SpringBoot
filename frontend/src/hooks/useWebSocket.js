import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function useWebSocket() {
  const { user } = useAuth();
  const stompClient = useRef(null);

  useEffect(() => {
    // Only connect if the user is actively logged in
    if (!user || !user.id) return;

    // Use the exact /ws endpoint we configured in Spring Boot
    // const socket = new SockJS('http://localhost:8080/ws'); for local development
    const socket =new SockJS('/ws'); // for production deployment
    
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('🌐 Connected to Live Notification Server');
        
        // Subscribe to this specific user's topic channel
        client.subscribe(`/topic/notifications/${user.id}`, (message) => {
          // Trigger the beautiful toast notification automatically
          toast.success(message.body, {
            duration: 6000,
            position: 'top-right',
            style: {
              background: '#10B981', // Emerald green
              color: '#fff',
              fontWeight: 'bold',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          });

          // ---> NEW: Broadcast an event to the rest of the React app! <---
          window.dispatchEvent(new Event('websocket-update'));
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      }
    });

    client.activate();
    stompClient.current = client;

    // Clean up the connection when the user logs out or closes the tab
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [user]);
}