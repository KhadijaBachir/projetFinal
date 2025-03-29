import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

/**
 * Ajoute un défi utilisateur à Firestore
 * @param {string} name - Nom du défi
 * @param {string} description - Description du défi
 * @param {string} category - Catégorie du défi
 * @param {string} color - Couleur du défi
 * @returns {Promise<string>} - ID du défi ajouté
 */
export const addUserChallenge = async (name, description, category, color) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Utilisateur non connecté !");

    const newChallenge = {
      name,
      description,
      category,
      color,
      userId,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "userChallenges"), newChallenge);
    console.log("Défi ajouté avec l'ID : ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout du défi : ", error);
    throw error;
  }
};



/**
 * Récupère les défis utilisateur par catégorie
 * @param {string} category - Catégorie des défis à récupérer
 * @param {function} callback - Fonction de rappel pour traiter les défis récupérés
 * @returns {function} - Fonction pour désabonner l'écouteur
 */
export const getUserChallenges = (category, callback) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Utilisateur non connecté !");

  const q = query(
    collection(db, "userChallenges"),
    where("category", "==", category),
    where("userId", "==", userId)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const challengesData = [];
      querySnapshot.forEach((doc) => {
        challengesData.push({ id: doc.id, ...doc.data() });
      });
      callback(challengesData);
    },
    (error) => {
      console.error("Erreur lors de la récupération des défis : ", error);
    }
  );

  return unsubscribe;
};

/**
 * Supprime un défi utilisateur
 * @param {string} challengeId - ID du défi à supprimer
 * @returns {Promise<void>}
 */
export const deleteUserChallenge = async (challengeId) => {
  try {
    await deleteDoc(doc(db, "userChallenges", challengeId));
    console.log("Défi supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du défi : ", error);
    throw error;
  }
};

/**
 * Met à jour un défi utilisateur
 * @param {string} challengeId - ID du défi à mettre à jour
 * @param {object} updatedData - Nouvelles données du défi
 * @returns {Promise<void>}
 */
export const updateUserChallenge = async (challengeId, updatedData) => {
  try {
    await updateDoc(doc(db, "userChallenges", challengeId), updatedData);
    console.log("Défi mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du défi : ", error);
    throw error;
  }
};