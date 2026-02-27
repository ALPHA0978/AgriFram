import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const saveProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'profiles', userId), {
      ...profileData,
      updatedAt: new Date().toISOString(),
      profileCompleted: true
    });
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const getProfile = async (userId) => {
  try {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

export const checkProfileCompleted = async (userId) => {
  try {
    const profile = await getProfile(userId);
    return profile?.profileCompleted || false;
  } catch (error) {
    console.error('Error checking profile:', error);
    return false;
  }
};
