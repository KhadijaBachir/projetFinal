// src/pages/CategoriesList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import {
  FaRunning,
  FaAppleAlt,
  FaBriefcase,
  FaHome,
  FaTasks,
  FaPrayingHands,
  FaSmile,
  FaBook,
  FaHandHoldingHeart,
  FaStar, // Icône pour "Autres Défis"
} from "react-icons/fa";

const CategoriesList = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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

  // Styles inline
  const styles = {
    categoriesContainer: {
      backgroundColor: "#ff6f61",
      minHeight: "100vh",
      padding: "0px 0",
    },
    categoryCard: {
      width: "100%",
      height: "300px",
      margin: "10px auto",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      border: "none",
      borderRadius: "15px",
      overflow: "hidden",
      background: "#ffffff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    categoryCardHover: {
      transform: "translateY(-10px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    },
    categoryIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      color: "#000000", // Icônes en noir
    },
    categoryTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold", // Titre en gras
      color: "#333333",
      marginBottom: "0.5rem",
    },
    categoryDescription: {
      fontSize: "1rem",
      color: "#666666",
      marginBottom: "1rem",
    },
    btnCustom: {
      padding: "8px 16px",
      borderRadius: "5px",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    btnReligion: {
      backgroundColor: "#6f42c1",
      borderColor: "#6f42c1",
      color: "white",
    },
    btnReligionHover: {
      backgroundColor: "#5a32a3",
      borderColor: "#5a32a3",
    },
    btnBienEtre: {
      backgroundColor: "#17a2b8",
      borderColor: "#17a2b8",
      color: "white",
    },
    btnBienEtreHover: {
      backgroundColor: "#138496",
      borderColor: "#138496",
    },
    btnEtudes: {
      backgroundColor: "#28a745",
      borderColor: "#28a745",
      color: "white",
    },
    btnEtudesHover: {
      backgroundColor: "#218838",
      borderColor: "#218838",
    },
    btnAutresDefis: {
      backgroundColor: "#ff8c7f", // Couleur pour "Autres Défis"
      borderColor: "#ff8c7f",
      color: "white",
    },
    btnAutresDefisHover: {
      backgroundColor: "#ff4500", // Couleur au survol
      borderColor: "#ff4500",
    },
  };

  // Gestion du survol des cartes
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = styles.categoryCardHover.transform;
    e.currentTarget.style.boxShadow = styles.categoryCardHover.boxShadow;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = styles.categoryCard.boxShadow;
  };

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", overflowX: "hidden" }}>
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
    @keyframes cardEntrance {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .animate-card {
      animation: cardEntrance 0.6s ease-out forwards;
      opacity: 0;
    }
  `}
         
        </style>
      </Navbar>

      {/* Image lafiffe.jpeg */}
      <img
        src="/x.webp"
        alt="Lafiffe"
        style={{ width: "100%", height: "450px", objectFit: "cover" }}
      />

      <Container className="py-5">
        <h1 className="text-center text-white display-4 mb-4" style={{ fontWeight: "bold" }}>
          Catégories de Défis
        </h1>
        <Row>
          {/* Sport */}
          <Col md={3} className="mb-4">
            <Card
              style={{ 
                ...styles.categoryCard,
                animationDelay: "0.1s"
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaRunning style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Sport</h5>
                <p style={styles.categoryDescription}>Défis physiques et sportifs pour te challenger !</p>
                <Link to="/category/sport" className="btn btn-primary" style={styles.btnCustom}>
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Nutrition */}
          <Col md={3} className="mb-4">
            <Card
              style={{ 
                ...styles.categoryCard,
                animationDelay: "0.2s"
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaAppleAlt style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Nutrition</h5>
                <p style={styles.categoryDescription}>Des défis pour améliorer ton alimentation et ta santé !</p>
                <Link to="/category/nutrition" className="btn btn-success" style={styles.btnCustom}>
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Travail */}
          <Col md={3} className="mb-4">
            <Card
              style={{ 
                ...styles.categoryCard,
                animationDelay: "0.3s"
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaBriefcase style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Travail</h5>
                <p style={styles.categoryDescription}>Défis pour booster ta productivité et ton efficacité !</p>
                <Link to="/category/travail" className="btn btn-warning" style={styles.btnCustom}>
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Tâches ménagères */}
          <Col md={3} className="mb-4">
            <Card
              style={{ 
                ...styles.categoryCard,
                animationDelay: "0.4s"
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaHome style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Tâches ménagères</h5>
                <p style={styles.categoryDescription}>Défis pour organiser et accomplir les tâches de la maison !</p>
                <Link to="/category/taches-menageres" className="btn btn-info" style={styles.btnCustom}>
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Bien-être */}
          <Col md={3} className="mb-4">
            <Card
             style={{ 
              ...styles.categoryCard,
              animationDelay: "0.5s"
            }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaSmile style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Bien-être</h5>
                <p style={styles.categoryDescription}>Des défis pour améliorer ton bien-être !</p>
                <Link
                  to="/category/bien-etre"
                  className="btn"
                  style={{ ...styles.btnCustom, ...styles.btnBienEtre }}
                >
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Religion */}
          <Col md={3} className="mb-4">
            <Card
             style={{ 
              ...styles.categoryCard,
              animationDelay: "0.6s"
            }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaPrayingHands style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Religion</h5>
                <p style={styles.categoryDescription}>Rapproche-toi de ton Seigneur !</p>
                <Link
                  to="/category/religion"
                  className="btn"
                  style={{ ...styles.btnCustom, ...styles.btnReligion }}
                >
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Études */}
          <Col md={3} className="mb-4">
            <Card
              style={{ 
                ...styles.categoryCard,
                animationDelay: "0.7s"
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaBook style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Études</h5>
                <p style={styles.categoryDescription}>Des défis pour être le meilleur en classe !</p>
                <Link
                  to="/category/etudes"
                  className="btn"
                  style={{ ...styles.btnCustom, ...styles.btnEtudes }}
                >
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Tâches repoussées */}
          <Col md={3} className="mb-4">
            <Card
              style={{ 
                ...styles.categoryCard,
                animationDelay: "0.8s"
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Body className="text-center">
                <FaTasks style={styles.categoryIcon} />
                <h5 style={styles.categoryTitle}>Tâches repoussées</h5>
                <p style={styles.categoryDescription}>Défis pour enfin accomplir ce que tu as toujours repoussé !</p>
                <Link to="/category/taches-repoussees" className="btn btn-danger" style={styles.btnCustom}>
                  Voir les détails
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Developpement-personnel */}
          <Col md={3} className="mb-4">
           <Card
              style={{ 
                ...styles.categoryCard,
                animationDelay: "0.9s"
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
           <Card.Body className="text-center">
               <FaHandHoldingHeart style={styles.categoryIcon} />
               <h5 style={styles.categoryTitle}>Développement Personnel</h5>
               <p style={styles.categoryDescription}>Défis pour booster sa personnalité!</p>
               <Link
               to="/category/developpement-personnel"
              className="btn"
              style={{ ...styles.btnCustom, backgroundColor: "#FF69B4", color: "white" }}
            >
            Voir les détails
      </Link>
    </Card.Body>
      </Card>
       </Col>
           {/* Autres Défis */}
          <Col md={3} className="mb-4">
        <Card
          style={{ 
            ...styles.categoryCard,
            animationDelay: "0.10s"
          }}
          onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
        >
        <Card.Body className="text-center">
        <FaStar style={styles.categoryIcon} />
        <h5 style={styles.categoryTitle}>Autres Défis</h5>
        <p style={styles.categoryDescription}>Crée tes propres défis personnalisés !</p>
        <Link
        to="/category/autres-defis"
        className="btn"
        style={{ ...styles.btnCustom, ...styles.btnAutresDefis }}
      >
        Voir les détails
      </Link>
    </Card.Body>
      </Card>
         </Col>
        </Row>
      </Container>

      {/* Footer */}
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

export default CategoriesList;