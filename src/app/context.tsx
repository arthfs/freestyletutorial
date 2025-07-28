"use client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { firestore_reference } from "./firebase"; // Import your firebase config
import { Dosis } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";


const UserContext = createContext();

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

if (Object.keys(user).length == 0 &&  ['loading','authenticated'].includes(status)) return <div> loading</div>
if (Object.keys(user).length == 0 && pathname.localeCompare('/login')!=0  ) 
  { 
  
    return <Link href='/login'>Please sign in to view this content.</Link>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const getcontext = () => useContext(UserContext);

