import { Avatar, Flex, WrapItem } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
export const Sidebar = () => {
  const { data: session } = useSession();
  return (
    <Flex bg="gray.200" width="300px">
      <Flex bg="white" height="fit-content" width="100%" padding="3">
        <WrapItem>
          <Avatar name="usuário logado" src={session?.user?.avatar_url} />
        </WrapItem>
        {session?.user?.login}
      </Flex>
    </Flex>
  );
};
