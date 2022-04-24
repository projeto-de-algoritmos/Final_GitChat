import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import SocketIOClient from 'socket.io-client';
import { Graph } from 'src/utils/graph';
import { edges } from '../../utils/distances';
import capitals from '../../utils/capitals.json';

export const ChatContextDefaultValues = {
  isDecoded: [],
  showDecoded: () => {},
  chat: [],
  setChat: () => {},
  connected: false,
  setConnected: () => {},
  socketState: null,
};

export const ChatContext = createContext(ChatContextDefaultValues);
ChatContext.displayName = 'ChatContext';

export const ChartProvider = ({ children, session }) => {
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState([]);
  const [socketState, setSocket] = useState(null);
  const [isDecoded, showDecoded] = useState(false);

  useEffect(() => {
    // connect to socket server
    const socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: '/api/socket',
    });

    setSocket(socket);

    // log socket connection
    socket.on('connect', async () => {
      console.log('SOCKET CONNECTED!', socket.id);

      setConnected(true);
    });

    // update chat on new message dispatched
    socket.on('message', async (message) => {
      chat.push(message);
      setChat([...chat]);
    });

    if (session?.user) {
      socket?.on('share_localization', async (localization, sender) => {
        const capitalGraph = new Graph();

        capitals.forEach((capital) => {
          capitalGraph.addVertex(capital);
        });

        Object.entries(edges).forEach((edge) => {
          const key = edge[0];
          const value = edge[1];
          capitalGraph.addEdge(key.split(':')[0], key.split(':')[1], value);
        });

        const distance = capitalGraph.dijkstra(session?.user?.locale, localization)?.distance;
        if (session?.user?.login !== sender) {
          toast.info(`${sender} mora em ${localization} - cerca de ${distance} km de distância de você!`);
        }
      });
    }
    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

  useEffect(() => {}, [session]);

  const values = useMemo(
    () => ({
      connected,
      setConnected,
      isDecoded,
      showDecoded,
      chat,
      setChat,
      socketState,
    }),
    [connected, isDecoded, chat, setConnected, showDecoded, setChat, socketState]
  );

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChart must be used within a ChartProvider');
  }

  return context;
}
