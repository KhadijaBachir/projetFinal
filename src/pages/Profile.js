import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { db, auth } from "../firebaseConfig"; // Importez `auth` pour récupérer l'ID de l'utilisateur connecté
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserChallenges } from "./userChallenges";

const Profile = () => {
  const [completedChallenges, setCompletedChallenges] = useState([]); // État pour les défis accomplis
  const [userChallenges, setUserChallenges] = useState([]); // État pour les défis personnalisés
  const [showAll, setShowAll] = useState(false); // État pour afficher tous les défis
  const userId = auth.currentUser?.uid; // Récupérer l'ID de l'utilisateur connecté

  // Récupérer les défis accomplis depuis Firestore en temps réel
  useEffect(() => {
    if (!userId) {
      console.error("Aucun utilisateur connecté !");
      return;
    }

    const userRef = doc(db, "users", userId);

    // Écouter les changements en temps réel
    const unsubscribe = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const challengesState = userDoc.data().challengesState || {};
        const completed = Object.entries(challengesState)
          .filter(([_, challenge]) => challenge.isCompleted) // Filtrer les défis accomplis
          .map(([challengeId, challenge]) => ({
            id: challengeId,
            name: challenge.challengeName || "Défi personnalisé", // Nom du défi
            description: challenge.userGoals || "Aucune description", // Description du défi
            completionDate: challenge.completionDate || new Date().toISOString(), // Date d'accomplissement
          }))
          .sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate)); // Trier par date décroissante

        setCompletedChallenges(completed);
      } else {
        console.error("Aucun document utilisateur trouvé !");
      }
    });

    // Nettoyer l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, [userId]);

  // Récupérer les défis personnalisés
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = getUserChallenges("defaultCategory", setUserChallenges);
    return () => unsubscribe();
  }, [userId]);

  // Combiner les défis accomplis et les défis personnalisés
  const allChallenges = [
    ...completedChallenges,
    ...userChallenges.map((challenge) => ({
      id: challenge.id,
      name: challenge.name || "Défi personnalisé", // Nom du défi
      description: challenge.description || "Aucune description", // Description du défi
      completionDate: challenge.createdAt || new Date().toISOString(), // Date de création
    })),
  ];

  // Supprimer un défi accompli
  const handleDeleteChallenge = async (challengeId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const challengesState = userDoc.data().challengesState || {};
        delete challengesState[challengeId]; // Supprimer le défi de l'état

        // Mettre à jour Firestore
        await updateDoc(userRef, { challengesState });
        setCompletedChallenges((prev) => prev.filter((challenge) => challenge.id !== challengeId));

        toast.success("Défi supprimé avec succès !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du défi :", error);
      toast.error("Erreur lors de la suppression du défi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Afficher seulement les 3 derniers défis par défaut
  const displayedChallenges = showAll ? allChallenges : allChallenges.slice(0, 3);

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", paddingTop: "80px" }}>
      <Container>
        <h1 className="text-center mb-4" style={{ color: "#fff", fontSize: "2.5rem", fontWeight: "bold" }}>
          Mon Profil
        </h1>

        {/* Informations personnelles */}
        <Card style={{ borderRadius: "15px", padding: "20px", maxWidth: "600px", margin: "0 auto", marginBottom: "20px" }}>
          <Card.Body>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>Informations personnelles</h2>
            <p style={{ fontSize: "1.2rem", color: "#555" }}>
              Nom: John Doe
              <br />
              Email: john.doe@example.com
              <br />
              Points: 1200
            </p>
          </Card.Body>
        </Card>

        {/* Défis accomplis */}
        <Card style={{ borderRadius: "15px", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
          <Card.Body>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333", marginBottom: "20px" }}>
              Défis Accomplis
            </h2>
            {displayedChallenges.length > 0 ? (
              <>
                <ListGroup>
                  {displayedChallenges.map((challenge) => (
                    <ListGroup.Item
                      key={challenge.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        borderRadius: "10px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "1.2rem", color: "#333" }}>{challenge.name}</span>
                        <br />
                        <small style={{ fontSize: "0.9rem", color: "#777" }}>
                          Description : {challenge.description} {/* Afficher la description */}
                        </small>
                        <br />
                        <small style={{ fontSize: "0.9rem", color: "#777" }}>
                          Accompli le : {new Date(challenge.completionDate).toLocaleDateString()} à{" "}
                          {new Date(challenge.completionDate).toLocaleTimeString()}
                        </small>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        style={{ padding: "5px 10px", borderRadius: "5px" }}
                      >
                        <FaTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                {allChallenges.length > 3 && (
                  <Button
                    variant="link"
                    onClick={() => setShowAll(!showAll)}
                    style={{ width: "100%", textAlign: "center", marginTop: "10px" }}
                  >
                    {showAll ? "Voir moins" : "Voir plus"} {showAll ? <FaChevronUp /> : <FaChevronDown />}
                  </Button>
                )}
              </>
            ) : (
              <p style={{ fontSize: "1.2rem", color: "#555", textAlign: "center" }}>
                Aucun défi accompli pour le moment.
              </p>
            )}
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Profile;