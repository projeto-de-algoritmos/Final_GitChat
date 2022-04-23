import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { api } from 'src/services/api';

export default async function auth(req, res) {
  const nextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: {
            label: 'Username',
            type: 'text',
            placeholder: 'username',
          },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          try {
            // Any object returned will be saved in `user` property of the JWT4

            const response = await api.get(`users/${credentials.username}`);
            console.log(response);
            return response.data;

            // If you return null or false then the credentials will be rejected
            // return null
            // You can also Reject this callback with an Error or with a URL:
            // throw new Error("error message") // Redirect to error page
            // throw "/path/to/redirect"        // Redirect to a URL
          } catch (error) {
            console.error('AUTHORIZE ERROR: ', error);

            return null;
          }
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/',
      signUp: '/',
      signOut: '/',
      error: '/',
    },
    callbacks: {
      async signIn({ user }) {
        if (user) return true;

        return false;
      },
      redirect({ url, baseUrl }) {
        if (url.startsWith(baseUrl)) return url;
        // Allows relative callback URLs
        if (url.startsWith('/')) return new URL(url, baseUrl).toString();

        return baseUrl;
      },
      jwt: async ({ token, user }) => {
        if (token?.user) {
          return token;
        }

        if (user) {
          token.user = user;
        }

        return token;
      },
      session: async ({ session, token }) => {
        session.user = token.user;
        session.token = token;

        return session;
      },
    },
  };

  // @ts-ignore
  return await NextAuth(req, res, nextAuthOptions);
}
