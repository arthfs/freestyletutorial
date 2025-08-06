'use client';  // Ensures this is a client-side component

import { setDoc, collection, doc,  query, where, limit, getDocs } from "firebase/firestore";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { firestore_reference } from "../firebase";
import Image from "next/image";

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const test = async(email:string)=>{
    const new_user = query (collection( firestore_reference,'users'),where('email','==',email),limit(1))
    const data = await getDocs(new_user)
  
    return data
  }

  useEffect (()=>{
    if (status == 'authenticated')
    {
    
      test(`${session.user?.email}`).then(async(result)=>{
       if (result.empty)
       {

       const reference =  doc(firestore_reference,`/users/${session.user?.id}`)

       try
       {
        await setDoc(reference,{
          'id' : session.user?.id,
          'name' : session.user?.name,
          'photo' : session.user?.image,
          'email': session.user?.email,
          'bookmarked' : [],
          'completed' :[],
          'liked' : []
        },{merge:true})
      
       }

       catch(e) 
       {
        console.log(e)
       }
        
      }
        router.push('/')
      })
      
    }

  },[router, session, status])
  const handleSignIn = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent the form from refreshing the page
     await signIn("google", { redirect:false }).then(()=>{console.log('true')}) // This automatically handles the redirect
    
 
  };
//console.log()
  return (
    <div className="loginpage">
      <div style={{fontSize:'40px',color:'white',textAlign:'center'}}>Login Page</div>
       
      <div className="loginsection" onClick={handleSignIn}>
        
        <div className="loginbutton">
        <Image src="/google.png" alt='logo' width={40} height={40} style={{borderRadius:20}}></Image>
       
          <div style={{cursor:'default'}}>Sign in with Google</div>
        
        </div>
        
    </div>
 
    </div>
  );
}
