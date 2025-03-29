import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCode } from "react-icons/fa";
import { Container, Row, Col, Card, ProgressBar, Form, InputGroup, Navbar, Nav, FormControl, Button } from "react-bootstrap";
import { FaCheckCircle, FaDumbbell, FaAppleAlt, FaBriefcase, FaBroom, FaTasks, FaPlus, FaTrash, FaStar, FaSmile, FaHandHoldingHeart, FaBook, FaPrayingHands } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import confetti from "canvas-confetti";
import "./CategoryDetails.css";
import defaultChallenges from "./defaultChallenges";

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

// Fonctions localStorage
const getChallengesState = () => JSON.parse(localStorage.getItem('challengesState')) || {};
const saveChallengesState = (state) => localStorage.setItem('challengesState', JSON.stringify(state));

const getUserChallenges = (category) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  return challenges.filter(challenge => challenge.category === category);
};

const addUserChallengeToStorage = (name, description, category, color) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  const newChallenge = {
    id: `uc${Date.now()}`,
    name,
    description,
    category,
    color,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('userChallenges', JSON.stringify([...challenges, newChallenge]));
  return newChallenge.id;
};

const deleteUserChallengeFromStorage = (id) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  const updated = challenges.filter(c => c.id !== id);
  localStorage.setItem('userChallenges', JSON.stringify(updated));
};

const getUserData = () => JSON.parse(localStorage.getItem('userData')) || { points: 0 };
const updateUserPoints = (pointsToAdd) => {
  const userData = getUserData();
  const newPoints = (userData.points || 0) + pointsToAdd;
  localStorage.setItem('userData', JSON.stringify({ ...userData, points: newPoints }));
  return newPoints;
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

const CategoryDetails = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [defaultChallengesList, setDefaultChallengesList] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [progress, setProgress] = useState({});
  const [isCompleted, setIsCompleted] = useState({});
  const [userGoals, setUserGoals] = useState({});
  const [newChallengeName, setNewChallengeName] = useState("");
  const [newChallengeDescription, setNewChallengeDescription] = useState("");
  const [columns, setColumns] = useState(3);
  const [userPoints, setUserPoints] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Détection de la taille d'écran
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768); // 768px est la taille typique pour les petits écrans
  };

  // Ajouter un écouteur d'événement pour détecter les changements de taille d'écran
  useEffect(() => {
    checkScreenSize(); // Vérifier la taille initiale
    window.addEventListener("resize", checkScreenSize); // Mettre à jour lors du redimensionnement
    return () => window.removeEventListener("resize", checkScreenSize); // Nettoyer l'écouteur
  }, []);

  // Images par catégorie
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

  // Nombre de colonnes en fonction de la largeur
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

  // Charger les défis par défaut
  useEffect(() => {
    if (!categoryName || categoryName === "autres-defis") return;
    const challenges = defaultChallenges[categoryName] || [];
    // Ajouter des couleurs uniques aux défis par défaut
    const challengesWithColors = challenges.map(challenge => ({
      ...challenge,
      color: getUniqueColor(challenges)
    }));
    setDefaultChallengesList(challengesWithColors);
  }, [categoryName]);

  // Charger les défis utilisateur
  useEffect(() => {
    const challenges = getUserChallenges(categoryName);
    setUserChallenges(challenges);
  }, [categoryName]);

  // Charger l'état des défis
  useEffect(() => {
    const state = getChallengesState();
    setIsCompleted(state.isCompleted || {});
    setProgress(state.progress || {});
    setUserGoals(state.userGoals || {});
  }, []);

  // Charger les points utilisateur
  useEffect(() => {
    setUserPoints(getUserData().points || 0);
  }, []);

  // Confettis
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Gestion des défis
  const handleCheckboxChange = (challengeId) => {
    const newIsCompleted = { ...isCompleted, [challengeId]: !isCompleted[challengeId] };
    const newProgress = { ...progress, [challengeId]: newIsCompleted[challengeId] ? 100 : 0 };

    setIsCompleted(newIsCompleted);
    setProgress(newProgress);
    
    const state = getChallengesState();
    saveChallengesState({
      ...state,
      [challengeId]: {
        ...state[challengeId],
        isCompleted: newIsCompleted[challengeId],
        progress: newProgress[challengeId],
        lastUpdated: new Date().toISOString()
      }
    });

    if (newIsCompleted[challengeId]) {
      const newPoints = updateUserPoints(5);
      setUserPoints(newPoints);
      triggerConfetti();
      toast.success("Félicitations ! Vous avez accompli ce défi. Et vous avez gagné 5 points");
    }
  };

  const handleResetChallenge = (challengeId) => {
    const newIsCompleted = { ...isCompleted, [challengeId]: false };
    const newProgress = { ...progress, [challengeId]: 0 };
    const newUserGoals = { ...userGoals, [challengeId]: "" };

    setIsCompleted(newIsCompleted);
    setProgress(newProgress);
    setUserGoals(newUserGoals);

    const state = getChallengesState();
    saveChallengesState({
      ...state,
      [challengeId]: {
        ...state[challengeId],
        isCompleted: false,
        progress: 0,
        userGoals: "",
        lastUpdated: new Date().toISOString()
      }
    });
  };

  const handleGoalChange = (challengeId, value) => {
    setUserGoals(prev => ({ ...prev, [challengeId]: value }));
    
    const state = getChallengesState();
    saveChallengesState({
      ...state,
      [challengeId]: {
        ...state[challengeId],
        userGoals: value,
        lastUpdated: new Date().toISOString()
      }
    });
  };

  const handleAddChallenge = () => {
    if (!newChallengeName.trim()) {
      toast.error("Veuillez saisir un nom pour le défi");
      return;
    }

    const color = getUniqueColor([...defaultChallengesList, ...userChallenges]);
    addUserChallengeToStorage(newChallengeName, newChallengeDescription, categoryName, color);
    setUserChallenges(getUserChallenges(categoryName));
    setNewChallengeName("");
    setNewChallengeDescription("");
    toast.success("Défi ajouté avec succès !");
  };

  const handleDeleteChallenge = (challengeId) => {
    deleteUserChallengeFromStorage(challengeId);
    setUserChallenges(prev => prev.filter(c => c.id !== challengeId));
    toast.success("Défi supprimé avec succès !");
  };

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Navbar avec adaptation pour petits écrans */}
      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#ff8c7f", padding: "10px 0" }}>
        <Container>
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

          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: "none" }} />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" style={{ alignItems: "center", marginRight: "5px" }}>
              {[
                { name: "Accueil", path: "/" },
                { name: "Tableau de bord", path: "/deadline" },
                { name: "Défis", path: "/categories-defis" },
                { name: "Récompenses", path: "/recompenses" },
                { name: "Suggestions", path: "/suggestion" },
                { name: "Profil", path: "/profile" },
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
                    e.target.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
                    e.target.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#fff";
                  }}
                >
                  {link.name}
                </Nav.Link>
              ))}
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

        <style>
          {`
            @keyframes spin {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(360deg); }
            }
          `}
        </style>
      </Navbar>

      {/* Contenu principal */}
      <Container>
        <br /><br /><br />
        <h1 className="text-center mb-4" style={{ color: "#ffffff", fontWeight: "bold", fontSize: isSmallScreen ? "2rem" : "2.5rem" }}>
          Défis de la catégorie : {categoryName}
        </h1>
        <div style={{ width: "100%", height: isSmallScreen ? "300px" : "450px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginBottom: "2rem" }}>
          <img src={`/${categoryImages[categoryName]}`} alt={`Catégorie ${categoryName}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }} />
        </div>
        
        {categoryName !== "autres-defis" && (
          <>
            <h2 className="section-title">Défis par défaut</h2>
            <Row>
              {defaultChallengesList.map((challenge) => (
                <Col md={4} key={challenge.id} className="mb-4">
                  <Card className="h-100 challenge-card" style={{ borderColor: challenge.color }}>
                    <Card.Body className="text-center">
                      {renderIcon(challenge.category)}
                      <h3 className="card-title">{challenge.name}</h3>
                      <p className="card-description">{challenge.description}</p>
                      <InputGroup className="mb-3">
                        <FormControl 
                          placeholder="Fixez votre objectif" 
                          value={userGoals[challenge.id] || ""} 
                          onChange={(e) => handleGoalChange(challenge.id, e.target.value)} 
                        />
                      </InputGroup>
                      <div className="progress-bar-container">
                        <ProgressBar now={progress[challenge.id] || 0} label={`${progress[challenge.id] || 0}%`} />
                      </div>
                      <div className="checkbox-container">
                        <Form.Check 
                          type="checkbox" 
                          id={`challenge-${challenge.id}`} 
                          label="Défi accompli" 
                          checked={isCompleted[challenge.id] || false} 
                          onChange={() => handleCheckboxChange(challenge.id)} 
                        />
                      </div>
                      <div className="button-container">
                        <Button 
                          className="reset-button" 
                          style={{ backgroundColor: challenge.color }} 
                          onClick={() => handleResetChallenge(challenge.id)}
                        >
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
                    <Form.Control 
                      type="text" 
                      placeholder="Nom du défi" 
                      value={newChallengeName} 
                      onChange={(e) => setNewChallengeName(e.target.value)} 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Description du défi" 
                      value={newChallengeDescription} 
                      onChange={(e) => setNewChallengeDescription(e.target.value)} 
                    />
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
                      <FormControl 
                        placeholder="Fixez votre objectif" 
                        value={userGoals[challenge.id] || ""} 
                        onChange={(e) => handleGoalChange(challenge.id, e.target.value)} 
                      />
                    </InputGroup>
                    <div className="progress-bar-container">
                      <ProgressBar now={progress[challenge.id] || 0} label={`${progress[challenge.id] || 0}%`} />
                    </div>
                    <div className="checkbox-container">
                      <Form.Check 
                        type="checkbox" 
                        id={`challenge-${challenge.id}`} 
                        label="Défi accompli" 
                        checked={isCompleted[challenge.id] || false} 
                        onChange={() => handleCheckboxChange(challenge.id)} 
                      />
                    </div>
                    <div className="button-container">
                      <Button 
                        className="reset-button" 
                        style={{ backgroundColor: challenge.color }} 
                        onClick={() => handleResetChallenge(challenge.id)}
                      >
                        Recommencer
                      </Button>
                      <FaTrash 
                        className="delete-icon" 
                        onClick={() => handleDeleteChallenge(challenge.id)} 
                        style={{ cursor: "pointer", marginLeft: "10px" }} 
                      />
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