// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const allowedIPs = ["176.150.41.253", "82.66.241.186"];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      authorize: async (credentials, req) => {
        const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (allowedIPs.includes(userIP)) {
          return { id: 1, name: "IP-Authorized User", email: "ip-user@example.com" };
        }

        if (credentials.username === process.env.ADMIN_USERNAME &&
            credentials.password === process.env.ADMIN_PASSWORD) {
          return { id: 2, name: "Admin", email: "admin@example.com" };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',  // Assurez-vous que cette page existe
    error: '/auth/error',    // Assurez-vous que cette page existe
  },
  session: {
    strategy: "jwt",
    secret: process.env.JWT_SECRET
  }
});