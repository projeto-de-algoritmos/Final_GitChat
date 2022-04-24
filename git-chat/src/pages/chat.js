import { Chat as ChatComponent } from '../components/Chat.js';
import { BaseLayout } from 'src/layouts/Base/index.js';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  try {
    const session = await getSession(context);

    return {
      props: { session: session },
    };
  } catch (error) {
    console.log(error);

    return {
      props: { session: null },
    };
  }
}

const Chat = ({ session }) => {
  return (
    <BaseLayout>
      <ChatComponent session={session} />
    </BaseLayout>
  );
};

export default Chat;
