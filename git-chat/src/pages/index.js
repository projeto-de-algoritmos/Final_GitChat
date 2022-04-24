import { Flex } from '@chakra-ui/react';
import { SignInForm } from 'src/components/SignInForm';

export default function Home() {
  return (
    <Flex alignItems="center" justifyContent="center" minH="100vh">
      <SignInForm />
    </Flex>
  );
}
