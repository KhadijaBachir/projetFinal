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
import { sendChallengesToFirestore } from "./firebaseConfig"; // Importer la fonction

const App = () => {
  // Envoyer les défis à Firestore au démarrage de l'application
  useEffect(() => {
    sendChallengesToFirestore();
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
      </Routes>
    </Router>
  );
};

export default App;