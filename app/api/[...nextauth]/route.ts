import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Ensure session.strategy is typed correctly in authOptions
const fixedAuthOptions = {
  ...authOptions,
  session: {
	...authOptions.session,
	strategy: "jwt" as const, // or use SessionStrategy.JWT if imported
  },
};

const handler = NextAuth(fixedAuthOptions);

export { handler as GET, handler as POST };
