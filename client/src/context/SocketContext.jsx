import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null); // Initialize socket as null initially
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            // Initialize socket only when userInfo is available
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socket.current.on('connect', () => {
                console.log('Connected to socket server');
            });

            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage} = useAppStore.getState();
                // console.log({selectedChatData})
                console.log('test1')
                // console.log({selectedChatType})
                if (selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    console.log('Message received:', message);
                    addMessage(message);
                }
            };

            socket.current.on('receiveMessage', handleReceiveMessage);

            // return () => {
            //     // Cleanup when userInfo changes or component unmounts
            //     if (socket.current) {
            //         socket.current.off('receiveMessage', handleReceiveMessage);
            //         socket.current.disconnect();
            //     }
            // };
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
