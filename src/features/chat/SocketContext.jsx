import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOnlineUsers, setConnected, addMessage } from './chatSlice';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { chatToken, isStudent } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        let isMounted = true;
        let currentSocket = null;

        // Only connect if user is a student and has chat token
        if (isStudent && chatToken && user) {
            const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;

            // Lazy load socket.io-client only when needed
            setIsLoading(true);
            import('socket.io-client')
                .then((socketModule) => {
                    if (!isMounted) return; // Component unmounted during load

                    const { io } = socketModule;

                    // Create socket connection
                    currentSocket = io(CHAT_API_URL, {
                        query: {
                            userId: user.user_id || user.id,
                        },
                        auth: {
                            token: chatToken,
                        },
                    });

                    currentSocket.on('connect', () => {
                        console.log('✅ Connected to chat server');
                        dispatch(setConnected(true));
                        setIsLoading(false);
                    });

                    currentSocket.on('disconnect', () => {
                        console.log('❌ Disconnected from chat server');
                        dispatch(setConnected(false));
                    });

                    currentSocket.on('getOnlineUsers', (users) => {
                        dispatch(setOnlineUsers(users));
                    });

                    currentSocket.on('newMessage', (message) => {
                        dispatch(addMessage(message));
                    });

                    setSocket(currentSocket);
                })
                .catch((error) => {
                    console.error('Failed to load socket.io-client:', error);
                    setIsLoading(false);
                });
        } else {
            // If not a student, ensure socket is closed
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }

        // Cleanup function
        return () => {
            isMounted = false;
            if (currentSocket) {
                currentSocket.close();
            }
            if (socket) {
                socket.close();
            }
        };
    }, [isStudent, chatToken, user, dispatch]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
