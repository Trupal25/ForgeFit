import GoogleProvider from "next-auth/providers/google"
import { error } from "console";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";

export const authOptions:NextAuthOptions = {

    providers:[ 
        CredentialsProvider({
            name:"email",
            credentials: {
                email:{label:"Email", type:"text"},
                password:{label:"Password", type:"password"}
                },
            async authorize(credentials){

                // if(!credentials?.email || !credentials.password){
                //     throw new Error("missing email or password");
                // }
                // try{
                //     await connectToDatabase();
                //     cosnt user = await User.findUnique()

                //     if(!user){
                //         throw new Error("user doesnt exist")
                //     }
                //     const isValid = bcrypt.compare(credentials.password,user.password)
                //     if(!isValid) throw new Error("Invalid credentials")


                //     return {
                //         id:user.id.toString(),
                //         email:user.email
                //     }
                // }catch(error){
                //     throw error
                // }
            }
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id;
            }
            return token
        }, 
        async session({session,token}){
            if(session.user){
                session.user.id = token.id;
            }
            return session
        }
    },
    session:{
        strategy:"jwt",
        maxAge:30 * 24 * 60 * 60
    },
    pages:{
        signIn:"/signin",
        error:"/signin"
    },
    secret:process.env.NEXTAUTH_SECRET
}
