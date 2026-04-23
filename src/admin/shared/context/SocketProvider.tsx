import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { SocketContext } from './SocketContext';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket] = useState<Socket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Disabled for Static Mockup
       return () => {};
    }, [queryClient]);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
