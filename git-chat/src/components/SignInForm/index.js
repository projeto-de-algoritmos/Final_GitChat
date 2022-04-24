import { Button, Flex, Input, Select } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import capitals from '../../utils/capitals.json';
export const SignInForm = () => {
  const { handleSubmit, register } = useForm();
  const router = useRouter();
  const onSubmit = async (credentials) => {
    // build message obj
    try {
      const response = await signIn('credentials', {
        ...credentials,
        redirect: false, // prevents page reload on error
      });

      if (response.ok) {
        toast.success('Seja bem vindo');
        router.push('/chat');
      }
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
        <Select placeholder="Capital do estado" {...register('password')}>
          {capitals.map((capital) => (
            <option value={capital} key={capital}>
              {capital}
            </option>
          ))}
        </Select>
        <Button type="submit">Entrar</Button>
      </Flex>
    </form>
  );
};
