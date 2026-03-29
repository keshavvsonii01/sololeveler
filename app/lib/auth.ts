import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from './db';
import { User } from '../models/user';
import { Progression } from '../models/progression';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          await connectDB();

          // Find user with password field (normally excluded)
          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Compare passwords
          const isPasswordValid = await user.comparePassword(credentials.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return user object (without password)
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('Authentication failed');
          }
        }
      },
    }),
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  callbacks: {
    // JWT callback - called when JWT is created/updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },

    // Session callback - called when session is checked
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.profilePicture = token.profilePicture as string;
      }
      return session;
    },

    // Redirect callback - control where users are sent after login
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, it's safe
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Only allow redirects to the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + '/dashboard';
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export const handler = NextAuth(authOptions);