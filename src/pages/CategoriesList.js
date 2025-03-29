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
  FaStar,
} from "react-icons/fa";

const CategoriesList = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Détection de la taille d'écran
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Styles
  const styles = {
    appContainer: {
      backgroundColor: "#ff6f61",
      minHeight: "100vh",
      overflowX: "hidden",
    },
    navbar: {
      backgroundColor: "#ff8c7f",
      padding: "10px 0",
    },
    logo: {
      height: "150px",
      borderRadius: "55px",
      marginLeft: "-90px",
      "@media (max-width: 768px)": {
        height: "100px",
        marginLeft: "-20px",
      },
    },
    categoryCard: {
      width: "100%",
      height: "300px",
      margin: "10px auto",
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
      opacity: 0,
      transform: "translateY(20px)",
      transition: "all 0.3s ease-out",
      cursor: "pointer",
    },
    categoryIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      color: "#000000",
      transition: "all 0.3s ease",
    },
    categoryTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#333333",
      marginBottom: "0.5rem",
      transition: "all 0.3s ease",
    },
    categoryDescription: {
      fontSize: "1rem",
      color: "#666666",
      marginBottom: "1rem",
      transition: "all 0.3s ease",
    },
    btnCustom: {
      padding: "8px 16px",
      borderRadius: "5px",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
  };

  // Animation d'entrée des cartes
  useEffect(() => {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    });
  }, []);

  // Gestion du survol
  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const categories = [
    {
      icon: <FaRunning />,
      title: "Sport",
      description: "Défis physiques et sportifs pour te challenger !",
      color: "#007bff",
    },
    {
      icon: <FaAppleAlt />,
      title: "Nutrition",
      description: "Des défis pour améliorer ton alimentation et ta santé !",
      color: "#28a745",
    },
    {
      icon: <FaBriefcase />,
      title: "Travail",
      description: "Défis pour booster ta productivité et ton efficacité !",
      color: "#ffc107",
    },
    {
      icon: <FaHome />,
      title: "Tâches ménagères",
      description: "Défis pour organiser et accomplir les tâches de la maison !",
      color: "#17a2b8",
    },
    {
      icon: <FaSmile />,
      title: "Bien-être",
      description: "Des défis pour améliorer ton bien-être !",
      color: "#17a2b8",
    },
    {
      icon: <FaPrayingHands />,
      title: "Religion",
      description: "Rapproche-toi de ton Seigneur !",
      color: "#6f42c1",
    },
    {
      icon: <FaBook />,
      title: "Études",
      description: "Des défis pour être le meilleur en classe !",
      color: "#28a745",
    },
    {
      icon: <FaTasks />,
      title: "Tâches repoussées",
      description: "Défis pour enfin accomplir ce que tu as toujours repoussé !",
      color: "#dc3545",
    },
    {
      icon: <FaHandHoldingHeart />,
      title: "Développement Personnel",
      description: "Défis pour booster sa personnalité!",
      color: "#FF69B4",
    },
    {
      icon: <FaStar />,
      title: "Autres Défis",
      description: "Crée tes propres défis personnalisés !",
      color: "#ff8c7f",
    },
  ];

  return (
    <div style={styles.appContainer}>
      {/* Barre de navigation */}
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
      
      {/* Bannière */}
      <img
        src="/x.webp"
        alt="Bannière"
        style={{ width: "100%", height: "450px", objectFit: "cover" }}
      />

      {/* Contenu principal */}
      <Container className="py-5">
        <h1 className="text-center text-white display-4 mb-4" style={{ fontWeight: "bold" }}>
          Catégories de Défis
        </h1>
        
        <Row>
          {categories.map((category, index) => (
            <Col md={3} className="mb-4" key={index}>
              <Card
                className="category-card"
                style={{
                  ...styles.categoryCard,
                  transform: hoveredCard === index ? "scale(1.05) rotate(1deg)" : "scale(1)",
                  boxShadow: hoveredCard === index 
                    ? `0 15px 30px rgba(0, 0, 0, 0.3), 0 0 0 3px ${category.color}`
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Card.Body className="text-center">
                  <div style={{
                    ...styles.categoryIcon,
                    color: hoveredCard === index ? category.color : "#000000",
                    transform: hoveredCard === index ? "scale(1.2) rotate(10deg)" : "scale(1)",
                  }}>
                    {category.icon}
                  </div>
                  <h5 style={{
                    ...styles.categoryTitle,
                    color: hoveredCard === index ? category.color : "#333333",
                  }}>
                    {category.title}
                  </h5>
                  <p style={styles.categoryDescription}>{category.description}</p>
                  <Link
                    to={`/category/${category.title.toLowerCase().replace(" ", "-")}`}
                    className="btn"
                    style={{
                      ...styles.btnCustom,
                      backgroundColor: category.color,
                      color: "white",
                      transform: hoveredCard === index ? "scale(1.1)" : "scale(1)",
                      boxShadow: hoveredCard === index ? `0 4px 8px ${category.color}80` : "none",
                    }}
                  >
                    Voir les détails
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Pied de page */}
      <footer style={{ backgroundColor: "#333", padding: "20px 0" }}>
        <Container className="text-center">
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "10px" }}>
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <Icon key={i} size={25} color="#fff" style={{ cursor: "pointer" }} />
            ))}
          </div>
          <p style={{ color: "#fff", margin: 0 }}>© 2025 Challenge Master. Tous droits réservés.</p>
        </Container>
      </footer>

      {/* Styles d'animation */}
      <style>
        {`
         
          .category-card {
            animation: cardEntrance 0.6s ease-out forwards;
          }
          
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
        `}
      </style>
    </div>
  );
};

export default CategoriesList;