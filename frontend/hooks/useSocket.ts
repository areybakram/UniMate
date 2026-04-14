import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Use host IP if testing on physical device, otherwise localhost
// Backend port for sockets is 5001 as requested
const SOCKET_URL = 'http://172.16.7.33:5001'; 

export const useSocket = (roomId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      if (roomId) {
        socket.emit('join_room', roomId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (data: { roomId: string; senderId: string; text: string; timestamp: string }) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', data);
    }
  };

  const onMessage = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('receive_message', callback);
    }
  };

  return { socket: socketRef.current, isConnected, sendMessage, onMessage };
};
