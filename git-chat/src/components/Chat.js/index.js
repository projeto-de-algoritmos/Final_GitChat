import { useEffect, useState } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import SocketIOClient from 'socket.io-client';
import { Graph } from 'src/utils/graph';
import { useSession } from 'next-auth/react';

export const Chat = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const { data: session } = useSession();
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState([]);
  useEffect(() => {
    // connect to socket server
    const socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: '/api/socket',
    });

    // log socket connection
    socket.on('connect', () => {
      console.log('SOCKET CONNECTED!', socket.id);
      setConnected(true);
    });

    // update chat on new message dispatched
    socket.on('message', (message) => {
      chat.push(message);
      console.log(message);
      setChat([...chat]);
    });

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

  const graph = new Graph();

  const onSubmit = async (data) => {
    // build message obj
    const message = {
      user: session?.user?.login,
      msg: data.msg,
    };
    graph.addVertex(data.msg);

    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column">
        {chat.map((message, index) => {
          return (
            <Flex flexDirection="column" key={index}>
              <Text color={session?.user?.login === message.user ? 'red.100' : 'blue.200'}>{message.user}</Text>
              <Text>{message.msg}</Text>
            </Flex>
          );
        })}
      </Flex>
      <Flex flexDirection="column" boxShadow="base" width="400px" padding="10" gap="1rem">
        <Input {...register('msg')} color="teal" placeholder="Type a message" _placeholder={{ color: 'inherit' }} />
        <Button type="submit">Send message</Button>
      </Flex>
    </form>
  );
};
