import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { compare } from "bcrypt";
import clientPromise from "./mongodb";  // adapter client
import { User } from "@/models/User";
import {  dbConnect } from "./db";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials: any) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) token.role = user.role;
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
};
