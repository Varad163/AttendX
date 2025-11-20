import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { dbConnect } from "./db";
import { User } from "@/models/User";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,

  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },

      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const ok = await compare(credentials.password, user.password);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          classId: user.classId ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.classId = user.classId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.classId = token.classId as string | null;
      return session;
    },
  },
};
