import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import NextAuth, { RequestInternal } from "next-auth";
import { NextApiRequest } from "next";

interface User{
    username:string,
    password:string
}

const handler = NextAuth({
  pages:{
    signIn:"/signin",
    signOut:"/"
  },
    providers: [
        CredentialsProvider({
          name: "email",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "USername" },
            password: { label: "Password", type: "password" }
          },
          // @ts-ignore
          async authorize(credentials: Record<string, string> | undefined,
            req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'> ){
            // Add logic here to look up the user from the credentials supplied
            const username = credentials?.username;
            const password = credentials?.password;
            const user = { 
                username:username,
                password:password
             }
      
            if (user) {
              // Any object returned will be saved in `user` property of the JWT
              return user
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              return null
      
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
          }
        }),
        
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
          })

      ]
})


export { handler as GET, handler as POST };