import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { FaTrophy, FaMedal, FaGift, FaStar, FaCrown, FaPalette, FaRocket, FaChartLine, FaKey, FaClock, FaMagic, FaSmile, FaFire, FaAward, FaBolt, FaDumbbell, FaCertificate } from "react-icons/fa";
import { db, doc, getDoc, setDoc, onSnapshot, updateUserPoints, addUserReward } from "../firebaseConfig"; // Importez les fonctions nécessaires
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

const messagesMotivants = [
  "Bravo ! Chaque défi te rapproche de ton objectif ! 🚀",
  "Tu es incroyable ! Continue sur cette lancée ! 💪",
  "Un pas de plus vers la victoire ! 🎯",
  "Les légendes ne s'arrêtent jamais ! 🏆",
  "Ta persévérance est exemplaire ! 🔥",
  "Chaque défi accompli est une victoire sur toi-même ! 👏",
  "Ne lâche rien, tu es sur la bonne voie ! 🌟",
  "La réussite est au bout du chemin, continue ! 🏅"
];

const Recompenses = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [messageMotivant, setMessageMotivant] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [recompensesGagnees, setRecompensesGagnees] = useState([]);

  const userId = "user-id"; // Remplace par l'ID de l'utilisateur connecté

  const recompensesParNiveau = {
    "Débutant (1-5)": [
      { id: 1, title: "Badge 'Nouveau Challenger'", pointsRequired: 100, icon: <FaCertificate size={50} className="text-primary" /> },
      { id: 2, title: "Autocollant de Bienvenue 🎉", pointsRequired: 150, icon: <FaSmile size={50} className="text-warning" /> },
      { id: 3, title: "Défi Débloqué", pointsRequired: 50, icon: <FaGift size={50} className="text-success" /> },
      { id: 4, title: "Effet de Confettis 🎇", pointsRequired: 50, icon: <FaMagic size={50} className="text-danger" /> }
    ],
    "Intermédiaire (6-10)": [
      { id: 5, title: "Médaille d'Or", pointsRequired: 200, icon: <FaMedal size={50} className="text-warning" /> },
      { id: 6, title: "Badge 'Défi Accepté'", pointsRequired: 300, icon: <FaAward size={50} className="text-info" /> },
      { id: 7, title: "Champion du Jour", pointsRequired: 350, icon: <FaTrophy size={50} className="text-danger" /> },
      { id: 8, title: "Défi Surprise 🔥", pointsRequired: 250, icon: <FaBolt size={50} className="text-warning" /> },
      { id: 9, title: "Temps Supplémentaire ⏳", pointsRequired: 350, icon: <FaClock size={50} className="text-primary" /> }
    ],
    "Avancé (11-20)": [
      { id: 10, title: "Badge 'Expert des Défis'", pointsRequired: 700, icon: <FaAward size={50} className="text-success" /> },
      { id: 11, title: "Champion de la semaine", pointsRequired: 550, icon: <FaTrophy size={50} className="text-warning" /> },
      { id: 12, title: "Défi du mois", pointsRequired: 700, icon: <FaTrophy size={50} className="text-danger" /> },
      { id: 13, title: "Maître du sport", pointsRequired: 800, icon: <FaDumbbell size={50} className="text-primary" /> },
      { id: 14, title: "Clé de Déblocage 🔑", pointsRequired: 600, icon: <FaKey size={50} className="text-dark" /> },
      { id: 15, title: "Autocollant 'Super Héros' 🦸‍♂️", pointsRequired: 350, icon: <FaStar size={50} className="text-warning" /> }
    ],
    "Maître des Défis (21+)": [
      { id: 16, title: "Trophée 'Légende des Défis' 🏆", pointsRequired: 1000, icon: <FaCrown size={50} className="text-warning" /> },
      { id: 17, title: "Classement des Champions 🏅", pointsRequired: 900, icon: <FaChartLine size={50} className="text-success" /> },
      { id: 18, title: "Accès à un Défi Exclusif 🚀", pointsRequired: 500, icon: <FaRocket size={50} className="text-info" /> },
      { id: 19, title: "Personnalisation du Profil 🎨", pointsRequired: 400, icon: <FaPalette size={50} className="text-danger" /> }
    ]
  };

  // Récupérer les points et les récompenses de l'utilisateur depuis Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUserPoints(userDoc.data().points || 0);
        setRecompensesGagnees(userDoc.data().rewards || []);
      } else {
        console.log("Aucun utilisateur trouvé avec cet ID.");
      }
    };

    fetchUserData();

    // Ajouter un écouteur pour les mises à jour en temps réel
    const unsubscribe = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        setUserPoints(doc.data().points || 0);
        setRecompensesGagnees(doc.data().rewards || []);
      }
    });

    return () => unsubscribe(); // Nettoyer l'écouteur
  }, [userId]);

  // Fonction pour débloquer une récompense
  const unlockReward = async (reward) => {
    if (userPoints >= reward.pointsRequired) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const currentRewards = userDoc.data()?.rewards || [];

      // Vérifie si la récompense est déjà débloquée
      if (!currentRewards.some((r) => r.id === reward.id)) {
        const updatedRewards = [...currentRewards, reward];
        await addUserReward(userId, reward); // Utilisez la fonction addUserReward
        setRecompensesGagnees(updatedRewards); // Met à jour l'état local
        setShowConfetti(true);
        setMessageMotivant(messagesMotivants[Math.floor(Math.random() * messagesMotivants.length)]);
        setTimeout(() => setShowConfetti(false), 3000);
        setShowVideo(true); // Affiche la vidéo après avoir débloqué la récompense
        toast.success(`Félicitations ! Vous avez débloqué la récompense : ${reward.title}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.warning("Vous avez déjà débloqué cette récompense.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      toast.error("Vous n'avez pas assez de points pour débloquer cette récompense.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", overflowX: "hidden", padding: "20px" }}>
      {showConfetti && <Confetti />}
      <Container>
        <h1 className="text-center mb-4" style={{ color: "#ffffff", fontWeight: "bold", fontSize: "2.5rem", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
          Mes Récompenses
        </h1>

        {/* Section des points de l'utilisateur */}
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center shadow-lg" style={{ background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)", border: "none", borderRadius: "15px" }}>
              <Card.Body>
                <FaTrophy size={50} color="#ffc107" />
                <h2 className="mt-3" style={{ color: "#343a40" }}>Points Accumulés</h2>
                <p className="display-4" style={{ color: "#343a40", fontWeight: "bold" }}>{userPoints}</p>
                <p style={{ color: "#343a40" }}>Utilisez vos points pour débloquer des récompenses exclusives !</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Section des récompenses disponibles */}
        {Object.entries(recompensesParNiveau).map(([niveau, recompenses], index) => (
          <div key={index} className="mt-5">
            <h3 className="text-success">{niveau}</h3>
            <div className="row">
              {recompenses.map((recompense, idx) => (
                <div key={idx} className="col-md-4 col-sm-6 mb-4">
                  <div className="card text-center shadow-lg p-3 border-0 rounded animate__animated animate__fadeInUp">
                    <div className="card-body">
                      <div className="mb-3">{recompense.icon}</div>
                      <h5 className="card-title text-dark">{recompense.title}</h5>
                      <p className="card-text text-muted">
                        Points requis : <strong>{recompense.pointsRequired}</strong>
                      </p>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => unlockReward(recompense)}
                        disabled={userPoints < recompense.pointsRequired || recompensesGagnees.some(r => r.id === recompense.id)}
                      >
                        {recompensesGagnees.some(r => r.id === recompense.id) ? "Débloqué" : "Obtenir"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {messageMotivant && (
          <div className="alert alert-success text-center mt-4 animate__animated animate__fadeInDown">
            <h5>{messageMotivant}</h5>
          </div>
        )}

        {showVideo && (
          <div className="mt-4 text-center">
            <h4>Vidéo de Motivation</h4>
            <video width="80%" controls>
              <source src="URL_DE_TON_VIDEO" type="video/mp4" />
              Ton navigateur ne prend pas en charge la vidéo.
            </video>
          </div>
        )}
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Recompenses;
