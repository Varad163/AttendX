import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    classId?: string | null;   // ⭐ Add this
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      classId?: string | null; // ⭐ Add this
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    classId?: string | null;   // ⭐ Add this
  }
}
