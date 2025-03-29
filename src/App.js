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

// Fonctions utilitaires pour localStorage
const initializeLocalStorage = () => {
  if (!localStorage.getItem('userChallenges')) {
    localStorage.setItem('userChallenges', JSON.stringify([]));
  }
  if (!localStorage.getItem('challengesState')) {
    localStorage.setItem('challengesState', JSON.stringify({}));
  }
  if (!localStorage.getItem('userData')) {
    localStorage.setItem('userData', JSON.stringify({
      points: 0,
      rewards: [],
      completedChallenges: []
    }));
  }
};

const addUserChallenge = (challenge) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  const newChallenge = {
    id: `uc${Date.now()}`,
    name: challenge.title,
    description: challenge.description,
    category: challenge.category,
    points: challenge.points,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('userChallenges', JSON.stringify([...challenges, newChallenge]));
};

const checkChallengesExist = () => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  return challenges.length > 0;
};

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
  ];

  // Initialiser le localStorage et les défis au démarrage
  useEffect(() => {
    initializeLocalStorage();
    
    const initializeChallenges = () => {
      try {
        const challengesExist = checkChallengesExist();
        
        if (!challengesExist) {
          initialChallenges.forEach(challenge => {
            addUserChallenge(challenge);
          });
          console.log("Défis initiaux ajoutés avec succès dans localStorage");
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

export default App;