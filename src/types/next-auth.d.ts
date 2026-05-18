import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "Admin" | "Manager" | "Staff";
    };
  }
  interface User {
    id: string;
    role: "Admin" | "Manager" | "Staff";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "Admin" | "Manager" | "Staff";
    id: string;
  }
}
