import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  onSnapshot,
  collection,
  query,
  where,
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSSvDGMByP-YEvY1MWqOOby_xQRlalYcc",
  authDomain: "myproject-e4bab.firebaseapp.com",
  projectId: "myproject-e4bab",
  storageBucket: "myproject-e4bab.appspot.com",
  messagingSenderId: "902895838078",
  appId: "1:902895838078:web:94c3c701127a7b5bc9492f",
  measurementId: "G-7P1TWLM6Y3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentification
export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      email,
      points: 0,
      rewards: [],
      challengesState: {},
      photoURL: "",
      createdAt: new Date().toISOString()
    });
    return userCredential.user;
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    throw error;
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Gestion du profil
export const uploadProfilePhoto = async (userId, file) => {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error("Le fichier doit être une image");
    }

    const fileExt = file.name.split('.').pop();
    const storageRef = ref(storage, `profilePhotos/${userId}.${fileExt}`);
    
    await uploadBytes(storageRef, file, {
      contentType: file.type
    });
    
    const downloadURL = await getDownloadURL(storageRef);
    
    await updateDoc(doc(db, "users", userId), {
      photoURL: downloadURL
    });
    
    return downloadURL;
  } catch (error) {
    console.error("Erreur d'upload de photo:", error);
    throw error;
  }
};

export const getUserData = (userId, callback) => {
  return onSnapshot(doc(db, "users", userId), (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt
      });
    } else {
      callback(null);
    }
  });
};

// Gestion des défis et points
export const updateChallengeState = async (userId, challengeId, challengeData) => {
  try {
    const userRef = doc(db, "users", userId);
    const challengeUpdate = {
      isCompleted: challengeData.isCompleted,
      progress: challengeData.progress || 0,
      challengeName: challengeData.name,
      userGoals: challengeData.userGoals || "",
      completionDate: challengeData.isCompleted ? new Date().toISOString() : null,
      lastUpdated: new Date().toISOString(),
      points: challengeData.points || 0
    };

    await updateDoc(userRef, {
      [`challengesState.${challengeId}`]: challengeUpdate,
      points: increment(challengeData.points || 0)
    });

    await checkAndUnlockRewards(userId);
  } catch (error) {
    console.error("Erreur de mise à jour du défi:", error);
    throw error;
  }
};

const checkAndUnlockRewards = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return;

  const userData = userDoc.data();
  const currentPoints = userData.points || 0;
  const unlockedRewards = userData.rewards || [];

  const rewardLevels = [
    { id: "bronze", name: "Badge Bronze", pointsRequired: 50, icon: "🥉" },
    { id: "silver", name: "Médaille Argent", pointsRequired: 150, icon: "🥈" },
    { id: "gold", name: "Trophée Or", pointsRequired: 300, icon: "🏆" }
  ];

  for (const reward of rewardLevels) {
    const isRewardUnlocked = unlockedRewards.some(r => r.id === reward.id);
    const hasEnoughPoints = currentPoints >= reward.pointsRequired;
    
    if (hasEnoughPoints && !isRewardUnlocked) {
      await updateDoc(userRef, {
        rewards: arrayUnion({
          ...reward,
          dateUnlocked: new Date().toISOString()
        })
      });
    }
  }
};

// Défis personnalisés
export const addUserChallenge = async (name, description, category, color) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Utilisateur non connecté");

    const docRef = await addDoc(collection(db, "userChallenges"), {
      name,
      description,
      category,
      color,
      userId,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur d'ajout de défi:", error);
    throw error;
  }
};

export const getUserChallenges = (category, callback) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Utilisateur non connecté");

  const q = query(
    collection(db, "userChallenges"),
    where("category", "==", category),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (querySnapshot) => {
    const challenges = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
    callback(challenges);
  });
};

export const deleteUserChallenge = async (challengeId) => {
  try {
    await deleteDoc(doc(db, "userChallenges", challengeId));
  } catch (error) {
    console.error("Erreur de suppression de défi:", error);
    throw error;
  }
};
// Ajoutez ces fonctions à la fin de votre fichier, avant les exports finaux

/**
 * Récupère l'état des défis d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} - État des défis
 */
export const fetchChallengesState = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().challengesState || {};
    }
    return {};
  } catch (error) {
    console.error("Error fetching challenges state:", error);
    throw error;
  }
};

/**
 * Met à jour les points d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {number} pointsToAdd - Points à ajouter (peut être négatif)
 * @returns {Promise<void>}
 */
export const updateUserPoints = async (userId, pointsToAdd) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      points: increment(pointsToAdd)
    });
    
    // Vérifie si des récompenses doivent être débloquées
    await checkAndUnlockRewards(userId);
  } catch (error) {
    console.error("Error updating user points:", error);
    throw error;
  }
};

export { auth, db, storage,  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
      
};