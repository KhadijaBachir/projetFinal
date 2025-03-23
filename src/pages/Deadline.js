import React, { useState, useEffect } from "react";
import { Trophy, CheckCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Deadline = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [location.state]);

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

      {/* Image en haut de la page */}
      <img
        src="/je.avif"
        alt="Joie"
        style={{
          width: "100%",
          height: "525px",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          margin: "0",
          borderRadius: "0",
        }}
      />

      <div className="container py-5">
        <h1 className="text-center mb-5 display-4 fw-bold text-white">Tableau de Bord</h1>
        <div className="row g-4">
          {/* Défis en cours */}
          <div className="col-md-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="card h-100 border-primary shadow">
                <div className="card-body text-center p-4">
                  <CheckCircle size={48} className="text-primary mb-3" />
                  <h2 className="card-title fw-bold text-primary">Mes Défis</h2>
                  <p className="card-text text-muted">Pret pour l'aventure?</p>
                  <Link to="/categories-defis" className="btn btn-primary mt-3">Voir les détails</Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Points gagnés */}
          <div className="col-md-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="card h-100 border-warning shadow">
                <div className="card-body text-center p-4">
                  <Trophy size={48} className="text-warning mb-3" />
                  <h2 className="card-title fw-bold text-warning">Points gagnés</h2>
                  <p className="card-text text-muted">Accomplis tes défis et gagnes des récompenses</p>
                  <Link to="/recompenses" className="btn btn-warning mt-3">Voir les récompenses</Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Suggestions de défis */}
          <div className="col-md-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="card h-100 border-success shadow">
                <div className="card-body text-center p-4">
                  <Lightbulb size={48} className="text-success mb-3" />
                  <h2 className="card-title fw-bold text-success">Suggestions</h2>
                  <p className="card-text text-muted">Découvrez de nouveaux défis !</p>
                  <Link to="/explorateur" className="btn btn-success mt-3">Explorer</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#333", padding: "20px", marginTop: "50px" }}>
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
          <p style={{ color: "#fff", marginTop: "10px" }}>© 2025 GoChallenge Tous droits réservés.</p>
        </Container>
      </footer>

      {/* ToastContainer pour afficher les notifications */}
      <ToastContainer />
    </div>
  );
};

export default Deadline;