import { getSession } from 'next-auth/react';

export default async (req, res) => {
  const session = await getSession({ req });

  if (req.method === 'POST') {
    res?.socket?.server?.io?.emit('share_localization', session.user.locale, session.user.login);

    res.status(201).json({ localization: session.user.locale, sender: session.user.login });
  }
};
