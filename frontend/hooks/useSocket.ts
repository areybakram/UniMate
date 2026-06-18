import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { encrypt } from '../utils/encryption';
import { SOCKET_URL } from '../constants/config';

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
      const encryptedData = {
        ...data,
        text: encrypt(data.text)
      };
      socket.emit('send_message', encryptedData);
    }
  };

  return { socket, isConnected, sendMessage };
};
