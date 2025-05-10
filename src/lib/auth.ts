import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Add this type declaration to fix the type error with session user id
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
    providers: [ 
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This is a simple mock implementation for demo purposes
                // In a real app, you would validate against your database
                if (credentials?.email === "demo@forgefit.com" && credentials?.password === "password123") {
                    return {
                        id: "1",
                        name: "Demo User",
                        email: "demo@forgefit.com",
                        image: "https://i.pravatar.cc/150?u=demo@forgefit.com"
                    };
                }
                
                // Return null if user data could not be retrieved
                return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }, 
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    pages: {
        signIn: "/signin",
        error: "/signin"
    },
    secret: process.env.NEXTAUTH_SECRET
}
