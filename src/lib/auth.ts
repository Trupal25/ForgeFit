import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { getUserByEmail } from "./db/models/User";
import "../../next-auth.d.ts";
import prisma  from "@/lib/prisma"



export const authOptions: NextAuthOptions = {
    adapter:PrismaAdapter(prisma),
    providers: [ 
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try{

                    if(!credentials?.email || !credentials.password){
                        return null;
                    }
                    
                    const user = await getUserByEmail(credentials.email);
                    
                    if(user && user.password) {
                        const isMatch = await bcrypt.compare(credentials.password, user.password);
                        if (isMatch) {
                            return {
                                id: user.id?.toString() ,
                                name: user.name ,
                                email: user.email,
                            };
                        }
                    };

                return null;

                    }catch(error){
                         console.log("Error : ",error);    
                         return null;
                    }  
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }, 
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user && token.id) {
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
