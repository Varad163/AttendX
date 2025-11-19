import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

// 🔥 VERY IMPORTANT — EXPORT HANDLERS
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
