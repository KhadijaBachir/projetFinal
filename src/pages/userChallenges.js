import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Importez `auth` pour récupérer l'ID de l'utilisateur connecté

/**
 * Ajouter un défi utilisateur à Firestore
 * @param {string} name - Nom du défi
 * @param {string} description - Description du défi
 * @param {string} category - Catégorie du défi
 * @param {string} color - Couleur du défi
 * @returns {Promise<string>} - ID du défi ajouté
 */
export const addUserChallenge = async (name, description, category, color) => {
  try {
    const userId = auth.currentUser?.uid; // Récupérer l'ID de l'utilisateur connecté
    if (!userId) throw new Error("Utilisateur non connecté !");

    const newChallenge = {
      name, // Nom du défi
      description, // Description du défi
      category, // Catégorie du défi
      color, // Couleur du défi
      createdAt: new Date().toISOString(), // Date de création au format ISO
      userId, // ID de l'utilisateur
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
 * Récupérer les défis utilisateur par catégorie
 * @param {string} category - Catégorie des défis à récupérer
 * @param {function} callback - Fonction de rappel pour traiter les défis récupérés
 * @returns {function} - Fonction pour désabonner l'écouteur
 */
export const getUserChallenges = (category, callback) => {
  const userId = auth.currentUser?.uid; // Récupérer l'ID de l'utilisateur connecté
  if (!userId) throw new Error("Utilisateur non connecté !");

  const q = query(
    collection(db, "userChallenges"),
    where("category", "==", category),
    where("userId", "==", userId) // Filtrer par utilisateur
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const challengesData = [];
      querySnapshot.forEach((doc) => {
        challengesData.push({ id: doc.id, ...doc.data() });
      });
      callback(challengesData); // Appeler la fonction de rappel avec les données
    },
    (error) => {
      console.error("Erreur lors de la récupération des défis : ", error);
    }
  );

  return unsubscribe; // Retourner la fonction de désabonnement
};

/**
 * Supprimer un défi utilisateur
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
 * Mettre à jour un défi utilisateur
 * @param {string} challengeId - ID du défi à mettre à jour
 * @param {object} updatedData - Nouvelles données du défi (ex: { name: "Nouveau nom", description: "Nouvelle description" })
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