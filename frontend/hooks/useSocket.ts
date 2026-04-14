import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Use host IP if testing on physical device, otherwise localhost
const SOCKET_URL = 'http://172.16.7.33:5001'; 

export const useSocket = (roomId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      if (roomId) {
        console.log(`🔌 Socket joining room: ${roomId}`);
        newSocket.emit('join_room', roomId);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (data: { roomId: string; senderId: string; text: string; timestamp: string }) => {
    if (socket) {
      socket.emit('send_message', data);
    }
  };

  return { socket, isConnected, sendMessage };
};
