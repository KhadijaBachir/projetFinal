import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCode } from "react-icons/fa";
import { Container, Row, Col, Card, ProgressBar, Form, InputGroup, Navbar, Nav, FormControl, Button } from "react-bootstrap";
import { FaCheckCircle, FaDumbbell, FaAppleAlt, FaBriefcase, FaBroom, FaTasks, FaPlus, FaTrash, FaStar, FaSmile, FaHandHoldingHeart, FaBook, FaPrayingHands } from "react-icons/fa";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUserChallenge, getUserChallenges, deleteUserChallenge } from "./userChallenges";
import { updateChallengeState, fetchChallengesState, updateUserPoints } from "../firebaseConfig";
import confetti from "canvas-confetti";
import "./CategoryDetails.css";

const CategoryDetails = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [defaultChallenges, setDefaultChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [progress, setProgress] = useState({});
  const [isCompleted, setIsCompleted] = useState({});
  const [userGoals, setUserGoals] = useState({});
  const [newChallengeName, setNewChallengeName] = useState("");
  const [newChallengeDescription, setNewChallengeDescription] = useState("");
  const [columns, setColumns] = useState(3);
  const [userPoints, setUserPoints] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const userId = "user-id"; // Remplacez par l'ID de l'utilisateur connecté

  // Fonction pour détecter la taille de l'écran
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768); // 768px est la taille typique pour les petits écrans
  };

  // Ajouter un écouteur d'événement pour détecter les changements de taille d'écran
  useEffect(() => {
    checkScreenSize(); // Vérifier la taille initiale
    window.addEventListener("resize", checkScreenSize); // Mettre à jour lors du redimensionnement
    return () => window.removeEventListener("resize", checkScreenSize); // Nettoyer l'écouteur
  }, []);

  // Fonction pour générer une couleur aléatoire
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  };

  // Fonction pour obtenir une couleur unique
  const getUniqueColor = (challenges) => {
    let color;
    do {
      color = getRandomColor();
    } while (challenges.some((challenge) => challenge.color === color));
    return color;
  };

  // Fonction pour déclencher des confettis
  const triggerConfetti = () => {
    confetti({
      particleCount: 100, // Nombre de confettis
      spread: 70, // Étendue des confettis
      origin: { y: 0.6 }, // Position d'origine (0.6 = 60% du haut de l'écran)
    });
  };

  // Récupérer l'état des défis au chargement de la page
  useEffect(() => {
    const fetchState = async () => {
      const challengesState = await fetchChallengesState(userId);
      setIsCompleted(challengesState.isCompleted || {});
      setProgress(challengesState.progress || {});
      setUserGoals(challengesState.userGoals || {});
    };
    fetchState();
  }, [userId]);

  // Détecter la taille de l'écran et ajuster le nombre de colonnes
  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 992) setColumns(3);
      else if (screenWidth >= 768) setColumns(2);
      else setColumns(1);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Récupérer les points de l'utilisateur
  useEffect(() => {
    const fetchPoints = async () => {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) setUserPoints(userDoc.data().points || 0);
    };
    fetchPoints();
  }, [userId]);

  // Mappage des noms de catégories aux noms des images
  const categoryImages = {
    sport: "sport1.jpg",
    "bien-etre": "bienetre1.jpg",
    nutrition: "nutrition.jpg",
    "taches-menageres": "tacheM.jpg",
    "taches-repoussees": "fff.jpg",
    religion: "reli.jpg",
    travail: "tt.jpg",
    "autres-defis": "BB.jpg",
    etudes: "etude.jpg",
    "developpement-web": "dev.jpg",
    "developpement-personnel": "dev.jpg",
  };

  // Récupérer les défis par défaut (sauf pour "Autres Défis")
  useEffect(() => {
    if (!categoryName || categoryName === "autres-defis") return;

    const q = query(collection(db, "challenges"), where("category", "==", categoryName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const challengesData = [];
      querySnapshot.forEach((doc) => {
        const challenge = { id: doc.id, ...doc.data() };
        challenge.color = getUniqueColor(challengesData); // Attribue une couleur unique
        challengesData.push(challenge);
      });
      setDefaultChallenges(challengesData);
    });
    return () => unsubscribe();
  }, [categoryName]);

  // Récupérer les défis utilisateur
  useEffect(() => {
    const unsubscribe = getUserChallenges(categoryName, (challenges) => {
      const challengesWithColor = challenges.map((challenge) => ({
        ...challenge,
        color: getUniqueColor([...defaultChallenges, ...challenges]), // Attribue une couleur unique
      }));
      setUserChallenges(challengesWithColor);
    });
    return () => unsubscribe();
  }, [categoryName, defaultChallenges]);

  // Gérer la checkbox (défi accompli)
  const handleCheckboxChange = async (challengeId) => {
    const newIsCompleted = { ...isCompleted, [challengeId]: !isCompleted[challengeId] };
    const newProgress = { ...progress, [challengeId]: newIsCompleted[challengeId] ? 100 : 0 };

    setIsCompleted(newIsCompleted);
    setProgress(newProgress);

    if (newIsCompleted[challengeId] && !isCompleted[challengeId]) {
      const newPoints = userPoints + 5;
      setUserPoints(newPoints);
      await updateUserPoints(userId, newPoints);

      // Déclencher des confettis
      triggerConfetti();

      toast.success("Félicitations ! Vous avez accompli ce défi. Et vous avez gagnés 5 points", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    await updateChallengeState(
      userId,
      challengeId,
      newIsCompleted[challengeId],
      newProgress[challengeId],
      userGoals[challengeId] || "",
      defaultChallenges.find((challenge) => challenge.id === challengeId)?.name || "Défi sans nom",
      new Date()
    );
  };

  // Réinitialiser un défi
  const handleResetChallenge = async (challengeId) => {
    const newIsCompleted = { ...isCompleted, [challengeId]: false };
    const newProgress = { ...progress, [challengeId]: 0 };
    const newUserGoals = { ...userGoals, [challengeId]: "" };

    setIsCompleted(newIsCompleted);
    setProgress(newProgress);
    setUserGoals(newUserGoals);

    await updateChallengeState(
      userId,
      challengeId,
      newIsCompleted[challengeId],
      newProgress[challengeId],
      newUserGoals[challengeId],
      defaultChallenges.find((challenge) => challenge.id === challengeId)?.name || "Défi sans nom",
      null
    );
  };

  // Gérer la saisie des objectifs
  const handleGoalChange = async (challengeId, value) => {
    const newUserGoals = { ...userGoals, [challengeId]: value };
    setUserGoals(newUserGoals);

    await updateChallengeState(
      userId,
      challengeId,
      isCompleted[challengeId] || false,
      progress[challengeId] || 0,
      value,
      defaultChallenges.find((challenge) => challenge.id === challengeId)?.name || "Défi sans nom",
      isCompleted[challengeId] ? new Date() : null
    );
  };

  // Ajouter un défi utilisateur
  const handleAddChallenge = async () => {
    if (!newChallengeName || !newChallengeDescription) {
      toast.error("Veuillez remplir tous les champs.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const color = getUniqueColor([...defaultChallenges, ...userChallenges]); // Génère une couleur unique
      await addUserChallenge(newChallengeName, newChallengeDescription, categoryName, color); // Ajoute la couleur
      setNewChallengeName("");
      setNewChallengeDescription("");
      toast.success("Défi ajouté avec succès !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout du défi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Supprimer un défi utilisateur
  const handleDeleteChallenge = async (challengeId) => {
    try {
      await deleteUserChallenge(challengeId);
      toast.success("Défi supprimé avec succès !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
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

  // Afficher l'icône en fonction de la catégorie
  const renderIcon = (category) => {
    switch (category) {
      case "sport":
        return <FaDumbbell className="challenge-icon" />;
      case "nutrition":
        return <FaAppleAlt className="challenge-icon" />;
      case "travail":
        return <FaBriefcase className="challenge-icon" />;
      case "taches-menageres":
        return <FaBroom className="challenge-icon" />;
      case "taches-repoussees":
        return <FaTasks className="challenge-icon" />;
      case "autres-defis":
        return <FaStar className="challenge-icon" />;
      case "bien-etre":
        return <FaSmile className="challenge-icon" />;
      case "etudes":
        return <FaBook className="challenge-icon" />;
      case "religion":
        return <FaPrayingHands className="challenge-icon" />;
      case "developpement-personnel":
        return <FaHandHoldingHeart className="challenge-icon" />;
      case "developpement-web":
        return <FaCode className="challenge-icon" />;
      default:
        return <FaDumbbell className="challenge-icon" />;
    }
  };
return (
  <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", overflowX: "hidden" }}>
    {/* Navbar */}
    <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#ff8c7f", padding: "10px 0" }}>
      <Container>
        {/* Logo à gauche avec animation */}
        <Navbar.Brand as={Link} to="/">
          <img
            src="/log.jpg"
            alt="Logo"
            style={{
              height: isSmallScreen ? "100px" : "150px",
              borderRadius: "55px",
              animation: "spin 4s linear infinite",
              marginLeft: isSmallScreen ? "-20px" : "-90px",
            }}
          />
        </Navbar.Brand>

        {/* Titre à droite */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontSize: isSmallScreen ? "1.8rem" : "2.2rem",
            fontWeight: "bold",
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            color: "#fff",
            marginLeft: isSmallScreen ? "5px" : "20px",
            marginRight: "20px",
          }}
        >
          Challenge Master
        </Navbar.Brand>

        {/* Bouton de bascule pour les écrans mobiles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: "none" }} />

        {/* Liens de navigation */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{ alignItems: "center", marginRight: "5px" }}>
            {[
              { name: "Accueil", path: "/" },
              { name: "Tableau de bord", path: "/deadline" },
              { name: "Défis", path: "/categories-defis" },
              { name: "Récompenses", path: "/recompenses" },
              { name: "Suggestions", path: "/suggestion" },
              { name: "Profil", path: "/profile" }, // Lien vers Profile.js
            ].map((link, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={link.path}
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#fff",
                  margin: "0 10px",
                  transition: "all 0.3s ease",
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                  padding: "8px 12px",
                  borderRadius: "5px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 165, 0, 0.5)"; // Fond orange semi-transparent
                  e.target.style.color = "#fff"; // Texte blanc
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent"; // Fond transparent
                  e.target.style.color = "#fff"; // Texte blanc
                }}
              >
                {link.name}
              </Nav.Link>
            ))}
            {/* Bouton Connexion */}
            <Nav.Link
              as={Link}
              to="/auth"
              style={{
                backgroundColor: "#ff4500",
                borderRadius: "5px",
                padding: "9px 10px",
                color: "#fff",
                fontWeight: "500",
                transition: "background-color 0.3s",
                margin: "0 0px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9900")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4500")}
            >
              Connexion
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Styles globaux pour l'animation du logo */}
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotateY(0deg);
            }
            100% {
              transform: rotateY(360deg);
            }
          }
        `}
      </style>
    </Navbar>

    {/* Contenu principal */}
    <Container>
      <br /><br /><br />
      <h1 className="text-center mb-4" style={{ color: "#ffffff", fontWeight: "bold", fontSize: "2.5rem" }}>
        Défis de la catégorie : {categoryName}
      </h1>
      <div style={{ width: "100%", height: "450px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginBottom: "2rem" }}>
        <img src={`/${categoryImages[categoryName]}`} alt={`Catégorie ${categoryName}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }} />
      </div>
      {categoryName !== "autres-defis" && (
        <>
          <h2 className="section-title">Défis par défaut</h2>
          <Row>
            {defaultChallenges.map((challenge) => (
              <Col md={4} key={challenge.id} className="mb-4">
                <Card className="h-100 challenge-card" style={{ borderColor: challenge.color }}>
                  <Card.Body className="text-center">
                    {renderIcon(challenge.category)}
                    <h3 className="card-title">{challenge.name}</h3>
                    <p className="card-description">{challenge.description}</p>
                    <InputGroup className="mb-3">
                      <FormControl placeholder="Fixez votre objectif" value={userGoals[challenge.id] || ""} onChange={(e) => handleGoalChange(challenge.id, e.target.value)} />
                    </InputGroup>
                    <div className="progress-bar-container">
                      <ProgressBar now={progress[challenge.id] || 0} label={`${progress[challenge.id] || 0}%`} />
                    </div>
                    <div className="checkbox-container">
                      <Form.Check type="checkbox" id={`challenge-${challenge.id}`} label="Défi accompli" checked={isCompleted[challenge.id] || false} onChange={() => handleCheckboxChange(challenge.id)} />
                    </div>
                    <div className="button-container">
                      <Button className="reset-button" style={{ backgroundColor: challenge.color }} onClick={() => handleResetChallenge(challenge.id)}>
                        Recommencer
                      </Button>
                    </div>
                    {isCompleted[challenge.id] && (
                      <div className="completed-message">
                        <FaCheckCircle /> Félicitations ! Vous avez accompli ce défi.
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
      <h2 className="section-title">Mes Défis</h2>
      <br /><br />
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="form-card">
            <Card.Body>
              <h3 className="text-center mb-4">Ajouter un défi</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Nom du défi" value={newChallengeName} onChange={(e) => setNewChallengeName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control as="textarea" rows={3} placeholder="Description du défi" value={newChallengeDescription} onChange={(e) => setNewChallengeDescription(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleAddChallenge} className="w-100">
                  <FaPlus /> Ajouter un défi
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="mes-defis-section">
        <Row className="g-4" style={{ display: "flex", flexWrap: "wrap" }}>
          {userChallenges.map((challenge) => (
            <div key={challenge.id} style={{ width: `${100 / columns}%`, padding: "0 10px", boxSizing: "border-box" }} className="mb-4">
              <Card className="h-100 challenge-card" style={{ borderColor: challenge.color }}>
                <Card.Body className="text-center">
                  {renderIcon(challenge.category)}
                  <h3 className="card-title">{challenge.name}</h3>
                  <p className="card-description">{challenge.description}</p>
                  <InputGroup className="mb-3">
                    <FormControl placeholder="Fixez votre objectif" value={userGoals[challenge.id] || ""} onChange={(e) => handleGoalChange(challenge.id, e.target.value)} />
                  </InputGroup>
                  <div className="progress-bar-container">
                    <ProgressBar now={progress[challenge.id] || 0} label={`${progress[challenge.id] || 0}%`} />
                  </div>
                  <div className="checkbox-container">
                    <Form.Check type="checkbox" id={`challenge-${challenge.id}`} label="Défi accompli" checked={isCompleted[challenge.id] || false} onChange={() => handleCheckboxChange(challenge.id)} />
                  </div>
                  <div className="button-container">
                    <Button className="reset-button" style={{ backgroundColor: challenge.color }} onClick={() => handleResetChallenge(challenge.id)}>
                      Recommencer
                    </Button>
                    <FaTrash className="delete-icon" onClick={() => handleDeleteChallenge(challenge.id)} style={{ cursor: "pointer", marginLeft: "10px" }} />
                  </div>
                  {isCompleted[challenge.id] && (
                    <div className="completed-message">
                      <FaCheckCircle /> Félicitations ! Vous avez accompli ce défi.
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </div>
      </Container>
      <ToastContainer />
      <footer style={{ backgroundColor: "#333", padding: "20px", marginTop: "auto" }}>
        <Container className="text-center">
          <p style={{ color: "#fff", fontSize: "1.2rem" }}>Suivez-nous sur :</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} color="#ffffff" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={30} color="#ffffff" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} color="#ffffff" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={30} color="#ffffff" />
            </a>
          </div>
          <p style={{ color: "#fff", marginTop: "10px" }}>© 2025 GoChallenge. Tous droits réservés.</p>
        </Container>
      </footer>
    </div>
  );
};

export default CategoryDetails;