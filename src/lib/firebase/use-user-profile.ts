'use client';

import { useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { toast } from '@/hooks/use-toast';

export interface SavedCard {
  cardNumber: string;
  expiryDate: string;
  cardType: string;
}

export interface UserProfile {
  fullName: string;
  email?: string;
  phone?: string;
  role: 'traveler' | 'admin' | 'staff' | 'bus_owner';
  kycStatus?: 'none' | 'pending' | 'verified';
  kycDocumentType?: string;
  walletBalance?: number;
  savedCards?: SavedCard[];
}

export function useUserProfile(userId: string | undefined) {
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!userId) return null;
    return doc(firestore, 'users', userId);
  }, [firestore, userId]);

  const {
    data: userProfile,
    isLoading,
    error,
  } = useDoc<UserProfile>(userDocRef);

  const updateUserProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!userDocRef) return;

      try {
        await setDoc(userDocRef, data, { merge: true });
        // Silently update for background sync, toast only if needed
      } catch (e: any) {
        console.error("Profile update error:", e);
        toast({
          title: 'Error updating profile',
          description: e.message,
          variant: 'destructive',
        });
      }
    },
    [userDocRef]
  );

  return { userProfile, isLoading, error, updateUserProfile };
}
