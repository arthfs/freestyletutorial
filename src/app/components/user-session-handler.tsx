'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { firestore_reference } from '../page';
import { useUser } from '../context';

export const UserSessionHandler = () => {
  const { data: session } = useSession();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!session?.user?.id) return;

    const userRef = doc(firestore_reference, `users/${session.user.id}`);

    // Initial fetch
    getDoc(userRef).then(snap => {
      if (snap.exists()) {
        setUser(snap.data() as typeof user);
      }
    });

    // Real-time updates
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setUser(snap.data() as typeof user);
      }
    });

    return () => unsubscribe();
  }, [session?.user?.id, setUser]);

  return null;
};