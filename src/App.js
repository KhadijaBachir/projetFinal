import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Deadline from "./pages/Deadline";
import Explorateur from "./pages/Explorateur";
import Recompenses from "./pages/Recompenses";
import CategoriesList from "./pages/CategoriesList";
import Profile from "./pages/Profile";
import CategoryDetails from "./pages/CategoryDetails";
import "bootstrap/dist/css/bootstrap.min.css";
import { addUserChallenge } from "./firebaseConfig"; // Remplacement de l'import

const App = () => {
  // Données des défis à envoyer
  const initialChallenges = [
    {
      title: "Défi 1",
      description: "Description du défi 1",
      category: "sport",
      points: 10
    },
    {
      title: "Défi 2", 
      description: "Description du défi 2",
      category: "nutrition",
      points: 15
    }
    // Ajoutez d'autres défis si nécessaire
  ];

  // Envoyer les défis au démarrage
  useEffect(() => {
    const initializeChallenges = async () => {
      try {
        // Vérifier d'abord si des défis existent déjà
        const challengesExist = await checkChallengesExist();
        
        if (!challengesExist) {
          for (const challenge of initialChallenges) {
            await addUserChallenge(challenge);
          }
          console.log("Défis initiaux ajoutés avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des défis :", error);
      }
    };

    initializeChallenges();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Vos routes existantes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/deadline" element={<Deadline />} />
        <Route path="/categories-defis" element={<CategoriesList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category/:categoryName" element={<CategoryDetails />} />
        <Route path="/recompenses" element={<Recompenses />} />
        <Route path="/suggestion" element={<Explorateur />} />
        <Route path="/explorateur" element={<Explorateur />} />
      </Routes>
    </Router>
  );
};

// Fonction pour vérifier si des défis existent déjà
async function checkChallengesExist() {
  // Implémentation dépend de votre structure Firestore
  // Par exemple, vérifier si la collection 'challenges' contient des documents
  // Vous devrez peut-être importer db et getDocs depuis firebaseConfig
}

export default App;