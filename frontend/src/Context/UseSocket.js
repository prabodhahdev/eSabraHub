// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (serverUrl) => {
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io(serverUrl);

        // Clean up on unmount
        return () => {
            socketRef.current.disconnect();
        };
    }, [serverUrl]);

    return socketRef.current;
};

export default useSocket;
