import React, { useState, useEffect } from "react";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const AuthPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  // Détecter la taille de l'écran
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Gestion de l'inscription
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage(`Bienvenue ${name} ! Inscription réussie.`);
      toast.success(`Bienvenue ${name} ! Inscription réussie.`);
      navigate("/deadline", { state: { successMessage: `Bienvenue ${name} ! Inscription réussie.` } });
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  // Gestion de la connexion
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage(`Bienvenue ${name}, vous êtes connecté(e) !`);
      toast.success(`Bienvenue ${name}, vous êtes connecté(e) !`);
      navigate("/deadline", { state: { successMessage: `Bienvenue ${name}, vous êtes connecté(e) !` } });
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  // Gestion de la réinitialisation du mot de passe
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Un email de réinitialisation de mot de passe a été envoyé.");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation :", error);
      toast.error("Erreur lors de l'envoi de l'email de réinitialisation : " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
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
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isSmallScreen ? "column" : "row",
          backgroundColor: "#f5f5f5",
          padding: isSmallScreen ? "20px 0" : "0",
        }}
      >
        {/* Image pour les petits écrans */}
        {isSmallScreen && (
          <img
            src="/im10.avif"
            alt="Auth Banner"
            style={{
              width: "100%",
              height: "40vh",
              objectFit: "cover",
              borderRadius: "15px",
              marginBottom: "20px",
            }}
          />
        )}

        {/* Formulaire */}
        <div
          style={{
            width: isSmallScreen ? "90%" : "40%",
            maxWidth: "400px",
            padding: "40px",
            boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            backgroundColor: "white",
            margin: isSmallScreen ? "0 auto" : "0 3%",
            transition: "transform 0.3s ease",
          }}
        >
          {showSignUp ? (
            <form onSubmit={handleSignUp} style={styles.form}>
              <h2 style={styles.title}>Inscription</h2>
              <input
                type="text"
                placeholder="Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff6f61")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff6f61")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              />
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                  onMouseEnter={(e) => (e.target.style.borderColor = "#ff6f61")}
                  onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePasswordButton}
                  onMouseEnter={(e) => (e.target.style.color = "#ff6f61")}
                  onMouseLeave={(e) => (e.target.style.color = "#666")}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff6f61")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              />
              <button
                type="submit"
                style={styles.button}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff4500")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6f61")}
              >
                S'inscrire
              </button>
              <p
                style={styles.toggleText}
                onClick={() => setShowSignUp(false)}
                onMouseEnter={(e) => (e.target.style.color = "#ff4500")}
                onMouseLeave={(e) => (e.target.style.color = "#ff8c7f")}
              >
                Déjà un compte ? Connectez-vous
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignIn} style={styles.form}>
              <h2 style={styles.title}>Connexion</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff6f61")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              />
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                  onMouseEnter={(e) => (e.target.style.borderColor = "#ff6f61")}
                  onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePasswordButton}
                  onMouseEnter={(e) => (e.target.style.color = "#ff6f61")}
                  onMouseLeave={(e) => (e.target.style.color = "#666")}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                style={styles.button}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff4500")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6f61")}
              >
                Se connecter
              </button>
              <p
                style={styles.toggleText}
                onClick={() => setShowSignUp(true)}
                onMouseEnter={(e) => (e.target.style.color = "#ff4500")}
                onMouseLeave={(e) => (e.target.style.color = "#ff8c7f")}
              >
                Pas encore de compte ? Inscrivez-vous
              </p>
              <p
                style={styles.resetPassword}
                onClick={handlePasswordReset}
                onMouseEnter={(e) => (e.target.style.color = "#ff4500")}
                onMouseLeave={(e) => (e.target.style.color = "#ff8c7f")}
              >
                Mot de passe oublié ?
              </p>
            </form>
          )}
        </div>

        {/* Image pour les grands écrans */}
        {!isSmallScreen && (
          <img
            src="/im10.avif"
            alt="Auth Banner"
            style={{
              width: "50%",
              height: "calc(100vh - 80px)",
              objectFit: "cover",
              borderRadius: "15px",
            }}
          />
        )}
      </div>

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

      {/* ToastContainer pour afficher les notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

// Styles
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    width: "100%",
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  togglePasswordButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    position: "absolute",
    right: "10px",
    color: "#666",
    transition: "color 0.3s ease",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff6f61",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  toggleText: {
    color: "#ff8c7f",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    transition: "color 0.3s ease",
  },
  resetPassword: {
    color: "#ff8c7f",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
    transition: "color 0.3s ease",
  },
  image: {
    width: "50%",
    height: "calc(100vh - 80px)",
    objectFit: "cover",
    borderRadius: "15px",
  },
  "@media (max-width: 768px)": {
    container: {
      flexDirection: "column",
      height: "auto",
      padding: "20px",
    },
    formContainer: {
      width: "100%",
      maxWidth: "none",
      marginLeft: "0",
      marginTop: "20px",
    },
    image: {
      width: "100%",
      height: "40vh",
    },
  },
};

export default AuthPage;