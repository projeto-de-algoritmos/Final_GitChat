import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useChat } from 'src/context/ChatContext';
import { compress, decompress } from '../../utils/huffman';
export const Chat = ({ session }) => {
  const { handleSubmit, register } = useForm();

  const { chat, connected, isDecoded } = useChat();
  const onSubmit = async (data) => {
    const message = {
      user: session?.user?.login,
      msg: compress(data.msg).compressed,
      tree: compress(data.msg).tree,
    };

    await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  const shareLocalization = async (localization) => {
    await fetch('/api/share-localization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localization),
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column" background="gray.50" maxH="100vh" height="calc(100% - 40px)" overflowY="scroll">
        <Button onClick={async () => await shareLocalization(session?.user?.locale)}>Compartilhar distancia</Button>
        {chat.map((message, index) => {
          return (
            <Flex flexDirection="column" key={index} padding="10" paddingTop="0">
              <Flex flexDirection="column" marginLeft={session?.user?.login === message.user ? 'auto' : '0'}>
                {session?.user?.login !== message.user && <Text fontSize="smaller">{message.user}</Text>}
                <Text
                  minWidth="50px"
                  bg={session?.user?.login === message.user ? 'whatsapp.100' : 'white'}
                  width="fit-content"
                  borderRadius="md"
                  padding="1"
                >
                  {isDecoded ? decompress(message.msg, message.tree) : message.msg}
                </Text>
              </Flex>
            </Flex>
          );
        })}
        <Flex position="fixed" bottom="0" width="100%">
          <Input
            autoComplete="off"
            {...register('msg')}
            color="black.400"
            placeholder={connected ? 'Mensagem' : 'Conectando...'}
            _placeholder={{ color: 'gray.400' }}
          />
        </Flex>
      </Flex>
    </form>
  );
};
