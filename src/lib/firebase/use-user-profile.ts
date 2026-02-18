
'use client';

import { useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { toast } from '@/hooks/use-toast';

export interface SavedCard {
  cardNumber: string;
  expiryDate: string;
  cardType: string;
}

export interface UserProfile {
  fullName: string;
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
        await updateDoc(userDocRef, data);
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        });
      } catch (e: any) {
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
