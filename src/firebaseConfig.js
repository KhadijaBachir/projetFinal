import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

// Configuration Firebase (remplacez par votre propre configuration)
const firebaseConfig = {
  apiKey: "AIzaSyBSSvDGMByP-YEvY1MWqOOby_xQRlalYcc",
  authDomain: "myproject-e4bab.firebaseapp.com",
  projectId: "myproject-e4bab",
  storageBucket: "myproject-e4bab.appspot.com",
  messagingSenderId: "902895838078",
  appId: "1:902895838078:web:94c3c701127a7b5bc9492f",
  measurementId: "G-7P1TWLM6Y3",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialisation de l'authentification
const db = getFirestore(app); // Initialisation de Firestore
const googleProvider = new GoogleAuthProvider(); // Fournisseur Google pour l'authentification

// Fonction pour écouter les points de l'utilisateur en temps réel
const listenToUserPoints = (userId, callback) => {
  const userRef = doc(db, "users", userId); // Référence au document utilisateur
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      const points = userData.points || 0; // Récupérer les points (par défaut 0)
      callback(points); // Appeler le callback avec les nouveaux points
    } else {
      console.log("Aucun utilisateur trouvé !");
      callback(0); // Retourner 0 si l'utilisateur n'existe pas
    }
  });
};

// Fonction pour mettre à jour les points de l'utilisateur
const updateUserPoints = async (userId, newPoints) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { points: newPoints }, { merge: true }); // Mettre à jour les points
    console.log("Points mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des points :", error);
  }
};

// Fonction pour débloquer une récompense
const unlockRewardInFirestore = async (userId, reward) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      rewards: arrayUnion(reward), // Ajouter la récompense à la liste des récompenses
    });
    console.log(`Récompense "${reward.name}" débloquée !`);
  } catch (error) {
    console.error("Erreur lors du déblocage de la récompense :", error);
  }
};

// Fonction pour ajouter une récompense utilisateur
const addUserReward = async (userId, reward) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      rewards: arrayUnion(reward), // Ajouter la récompense à la liste des récompenses
    });
    console.log("Récompense ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la récompense :", error);
    throw error;
  }
};

// Fonction pour récupérer les récompenses de l'utilisateur
const fetchRewardsFromFirestore = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data()?.rewards || []; // Retourner les récompenses ou un tableau vide
  } catch (error) {
    console.error("Erreur lors de la récupération des récompenses :", error);
    return [];
  }
};

// Fonction pour mettre à jour l'état d'un défi
const updateChallengeState = async (userId, challengeId, isCompleted, progress, userGoals, challengeName, challengePoints) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    const challengesState = userData.challengesState || {};

    const name = challengeName || "Défi personnalisé"; // Nom du défi par défaut
    const description = userGoals || "Aucune description"; // Description par défaut

    // Mettre à jour l'état du défi
    challengesState[challengeId] = {
      isCompleted: isCompleted ?? false, // Définir si le défi est terminé
      progress: progress ?? 0, // Progression du défi
      userGoals: description, // Objectifs de l'utilisateur
      challengeName: name, // Nom du défi
      completionDate: isCompleted ? new Date().toISOString() : null, // Date de complétion si terminé
      lastUpdated: new Date().toISOString(), // Date de dernière mise à jour
      points: Number(challengePoints) || 0, // Points du défi (convertir en nombre)
    };

    // Mettre à jour les points de l'utilisateur si le défi est terminé
    if (isCompleted) {
      const currentPoints = userData.points || 0;
      const newPoints = currentPoints + (Number(challengePoints) || 0); // Calculer les nouveaux points
      await setDoc(userRef, { challengesState, points: newPoints }, { merge: true });
      console.log("État du défi et points mis à jour avec succès !");
    } else {
      await setDoc(userRef, { challengesState }, { merge: true });
      console.log("État du défi mis à jour avec succès !");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'état du défi :", error);
  }
};

// Fonction pour envoyer les défis à Firestore
const sendChallengesToFirestore = async () => {
  try {
    const challengesRef = collection(db, "challenges");
    const challenges = [
      // Exemple de défis
      { name: "Défi 1", description: "Description du défi 1", points: 10 },
      { name: "Défi 2", description: "Description du défi 2", points: 20 },
    ];
    await Promise.all(challenges.map((challenge) => addDoc(challengesRef, challenge))); // Ajouter chaque défi
    console.log("Défis envoyés avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi des défis :", error);
  }
};

// Fonction pour récupérer l'état des défis
const fetchChallengesState = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data()?.challengesState || {}; // Retourner l'état des défis ou un objet vide
  } catch (error) {
    console.error("Erreur lors de la récupération de l'état des défis :", error);
    return {};
  }
};

// Exporter toutes les fonctions et variables nécessaires
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  updateUserPoints,
  unlockRewardInFirestore,
  addUserReward,
  fetchRewardsFromFirestore,
  listenToUserPoints,
  updateChallengeState,
  sendChallengesToFirestore,
  fetchChallengesState,
};