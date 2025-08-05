"use client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, DocumentData, getDoc, getDocs, limit, onSnapshot, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { firestore_reference } from "./firebase"; // Import your firebase config

import Link from "next/link";
import { usePathname } from "next/navigation";


const UserContext = createContext({user:new QueryDocumentSnapshot<DocumentData, DocumentData>(),setUser:()=>{}, loading:false});

export default function ContextProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname()
  const get_user_data = async (email:string) => {
   
    if (!email) {
      setLoading(false);
      return;
    }
   
    const reference = query(collection(firestore_reference, `users`),where('email','==',email),limit(1));
    
    
    // Set up real-time listener
    
    const unsub = onSnapshot(reference, (snapshot) => {
      const userData = snapshot.docs[0] || {};
      setUser(userData);
      setLoading(false);
    });
    
    
    return unsub; // Return unsubscribe function
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.email) {
      get_user_data(session.user.email);
      setLoading
    } else {
      setLoading(false);
    }
  }, [session, status]);


if (  ['loading'].includes(status)) return <div> loading</div>
if (Object.keys(user).length == 0 && pathname.localeCompare('/login')!=0  && status.localeCompare('authenticated')!=0) 
  { 
 // console.log(Object.keys(user).length,status)
    return <div style={{height:'100vh',display:'flex', flexDirection:'column', justifyContent:'center',textAlign:'center'}}> <Link 
  href="/login"
  className="text-blue-600 underline hover:text-blue-800"
>
  Please sign in to view this content.
</Link> </div>
  }
  //console.log(Object.keys(user).length,status)
  if ((Object.keys(user).length>0 && status.localeCompare('authenticated')==0) ||(pathname.localeCompare('/login'==0)) )
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
return <div></div>
}

export const getcontext = () => useContext(UserContext);


