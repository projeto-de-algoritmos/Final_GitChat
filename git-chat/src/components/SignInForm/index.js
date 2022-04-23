import { useState } from 'react';
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Graph } from 'src/utils/graph';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
export const SignInForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const graph = new Graph();

  const onSubmit = async (credentials) => {
    // build message obj

    try {
      const response = await signIn('credentials', {
        ...credentials,
        redirect: false, // prevents page reload on error
      });

      if (response.ok) toast.success('Seja bem vindo');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column" boxShadow="base" width="400px" padding="10" gap="1rem">
        <Input
          {...register('username')}
          color="whatsapp.500"
          placeholder="Username"
          _placeholder={{ color: 'inherit' }}
        />

        <InputGroup size="md">
          <Input
            {...register('password')}
            color="whatsapp.500"
            type={show ? 'text' : 'password'}
            placeholder="Password"
            _placeholder={{ color: 'inherit' }}
          />
          <InputRightElement width="4.5rem">
            <Box cursor="pointer" onClick={handleClick}>
              {show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </Box>
          </InputRightElement>
        </InputGroup>
        <Button type="submit">Send message</Button>
      </Flex>
    </form>
  );
};
