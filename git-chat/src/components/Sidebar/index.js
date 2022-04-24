import { Avatar, Button, Flex, WrapItem } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useChat } from 'src/context/ChatContext';
export const Sidebar = () => {
  const { data: session } = useSession();

  const { isDecoded, showDecoded } = useChat();

  const handleDecoded = () => {
    showDecoded(!isDecoded);
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
    <Flex bg="gray.200" width="100%">
      <Flex bg="white" height="fit-content" width="100%" padding="3" justify="space-between" alignItems="center">
        <WrapItem>
          <Avatar name="usuário logado" src={session?.user?.avatar_url} />
        </WrapItem>
        {isDecoded ? (
          <AiOutlineEyeInvisible onClick={() => handleDecoded()} size={30} />
        ) : (
          <AiOutlineEye onClick={() => handleDecoded()} size={30} />
        )}
        <Button onClick={async () => await shareLocalization(session?.user?.locale)}>Compartilhar distancia</Button>
      </Flex>
    </Flex>
  );
};
