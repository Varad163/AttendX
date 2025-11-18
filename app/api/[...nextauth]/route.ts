import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // adjust import as needed

// Extend the adapter user to include 'role'
const adapter = MongoDBAdapter(clientPromise, {
  // @ts-ignore
  userModel: {
    role: { type: String, required: true },
  },
});

// Ensure session.strategy is typed correctly in authOptions
const fixedAuthOptions = {
  ...authOptions,
  adapter,
  session: {
    ...authOptions.session,
    strategy: "jwt" as const, // or use SessionStrategy.JWT if imported
  },
};

const handler = NextAuth(fixedAuthOptions);

export { handler as GET, handler as POST };
