import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const saveProfile = async (userId, profileData) => {
  const profileObj = {
    ...profileData,
    updatedAt: new Date().toISOString(),
    profileCompleted: true
  };

  // Always save to localStorage first for instant offline/local persistence
  localStorage.setItem(`profile_${userId || 'guest'}`, JSON.stringify(profileObj));

  try {
    if (userId && userId !== 'guest') {
      await setDoc(doc(db, 'profiles', userId), profileObj);
    }
    return true;
  } catch (error) {
    console.warn('Firestore remote save notice (saved to localStorage fallback):', error.message);
    // Return true since local persistence succeeded
    return true;
  }
};

export const getProfile = async (userId) => {
  const key = `profile_${userId || 'guest'}`;
  try {
    if (userId && userId !== 'guest') {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(key, JSON.stringify(data));
        return data;
      }
    }
  } catch (error) {
    console.warn('Firestore remote get notice (loading from localStorage fallback):', error.message);
  }

  // Fallback to local storage
  const local = localStorage.getItem(key);
  return local ? JSON.parse(local) : null;
};

export const checkProfileCompleted = async (userId) => {
  try {
    const profile = await getProfile(userId);
    return profile?.profileCompleted || false;
  } catch (error) {
    console.warn('Error checking profile completion:', error.message);
    const local = localStorage.getItem(`profile_${userId || 'guest'}`);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return parsed?.profileCompleted || false;
      } catch {
        return false;
      }
    }
    return false;
  }
};
