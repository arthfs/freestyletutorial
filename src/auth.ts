import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId : process.env.GOOGLE_CLIENT_ID
    ,clientSecret: process.env.GOOGLE_CLIENT_SECRET

  }),],
  pages:{
    signIn:'/login',
    error:'./auth/error',
    
    
  }, callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.sub! ; // Add the ID to the session
      return session;
    },
   
  },
})
