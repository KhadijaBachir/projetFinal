import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { FaCheck, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaSignOutAlt, FaLock, FaUnlock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import confetti from 'canvas-confetti';

// Défis et récompenses
const CHALLENGES = {
  DefiDuJour: [
    { text: "Bois 1L d'eau avant midi", emoji: "💧" },
    { text: "Supprime ou classe 10 emails inutiles", emoji: "📩" },
    { text: "Écris 3 choses que tu as bien faites aujourd'hui", emoji: "💪" },
    { text: "Jette ou donne 1 objet inutile chez toi", emoji: "🗑" },
    { text: "Souris à 5 inconnus dans la journée", emoji: "😊" },
    { text: "Écris un message gentil à un proche", emoji: "💌" },
    { text: "Prends un moment pour t'étirer 5 minutes", emoji: "🧘" },
    { text: "Essaie une nouvelle recette ou un aliment différent", emoji: "🍽️" },
    { text: "Marche pieds nus pendant 10 minutes", emoji: "🌿" },
    { text: "Écoute une audio de motivation que tu n'as jamais entendue", emoji: "🎵" }
  ],
  DefiSurprise: [
    { text: "Écris une pensée négative, puis déchire le papier", emoji: "🧠" },
    { text: "Pose ton téléphone et ne l'utilise pas pendant 1 heure", emoji: "📵" },
    { text: "Fais une sieste de 10 minutes", emoji: "😴" },
    { text: "Fais 15 squats et 10 pompes en 2 minutes", emoji: "⚡" },
    { text: "Dessine un autoportrait en 1 minute", emoji: "🎨" },
    { text: "Essaye d'écrire avec ta main non dominante", emoji: "✍️" },
    { text: "Fais un compliment sincère à quelqu'un aujourd'hui", emoji: "😊" },
    { text: "Essaye une posture de yoga que tu ne connais pas", emoji: "🕉️" },
    { text: "Regarde un coucher de soleil sans distractions", emoji: "🌅" },
    { text: "Apprends une phrase dans une nouvelle langue", emoji: "🗣️" }
  ],
  RouletteDesDefis: [
    { text: "Ferme les yeux et respire profondément pendant 2 minutes", emoji: "🧘‍♂️" },
    { text: "Range une zone de ta maison en moins de 5 minutes", emoji: "📋" },
    { text: "Apprends un mot dans une langue étrangère", emoji: "📚" },
    { text: "Marche 500 pas sans t'arrêter", emoji: "👣" },
    { text: "Tiens-toi droit, mains sur les hanches, pendant 2 minutes", emoji: "🦸‍♂️" },
    { text: "Médite 5 minutes en te concentrant sur ta respiration", emoji: "🌬️" },
    { text: "Déconnecte-toi des réseaux sociaux pendant 3 heures", emoji: "📵" },
    { text: "Fais une liste de 3 choses que tu aimerais accomplir cette semaine", emoji: "📝" },
    { text: "Fais un câlin (à quelqu'un ou à un coussin si besoin)", emoji: "🤗" },
    { text: "Essaye de marcher lentement et d'observer ton environnement", emoji: "🏞️" }
  ],
  DefiItem: [
    { text: "Note 3 choses cool qui se sont passées aujourd'hui", emoji: "📖" },
    { text: "Écris une note motivante et colle-la à un endroit visible", emoji: "📌" },
    { text: "Supprime une appli inutile de ton téléphone", emoji: "📱" },
    { text: "Lis au moins une page d'un livre inspirant", emoji: "📕" },
    { text: "Mange un repas entier avec une cuillère", emoji: "🥄" },
    { text: "Note 3 qualités que tu aimes chez toi", emoji: "❤️" },
    { text: "Change ton fond d'écran pour quelque chose de motivant", emoji: "📱" },
    { text: "Ajoute un rappel positif sur ton téléphone", emoji: "⏳" },
    { text: "Essaye un exercice de respiration profonde", emoji: "🫁" },
    { text: "Mange quelque chose que tu n'as pas goûté depuis longtemps", emoji: "🍏" }
  ]
};

const MOTIVATION = {
  phrases: [
    "Tu es capable de grandes choses, continue comme ça ! 🚀",
    "Chaque petit pas te rapproche de ton objectif. 💪",
    "Rappelle-toi, l'effort d'aujourd'hui est la réussite de demain. 🌟",
    "Le seul défi à relever, c'est toi-même. 💯",
    "Il n'y a pas de limite, juste des opportunités. 🎯",
    "Même un petit pas est un progrès 🚶‍♂️",
    "Tu es plus fort(e) que tu ne le penses 💪",
    "L'échec est juste une étape vers la réussite 🔄",
    "Ton futur moi te remerciera pour tes efforts d'aujourd'hui 🙌",
    "Rappelle-toi pourquoi tu as commencé 🌟"
  ],
  videos: [
    "https://www.youtube.com/embed/DIxjewEpjYU",
    "https://www.youtube.com/embed/gcRXpPSOSeI",
    "https://www.youtube.com/embed/oXcxDoab4ro",
    "https://www.youtube.com/embed/KRbCdd8eGow",
    "https://www.youtube.com/embed/D6qTPTj9g3I",
    "https://www.youtube.com/embed/qZcdiUqJjKw",
    "https://www.youtube.com/embed/loZ6PTeqcHM",
    "https://www.youtube.com/embed/or91sy5yk8",
    "https://www.youtube.com/embed/0UpjBtfiet4",
    "https://www.youtube.com/embed/kkbSY_1JuP8"
  ]
};

const CARD_COLORS = [
  { bg: '#6f42c1', text: '#FFFFFF' },
  { bg: '#4ECDC4', text: '#000000' },
  { bg: '#45B7D1', text: '#FFFFFF' },
  { bg: '#FFBE0B', text: '#000000' },
  { bg: '#8338EC', text: '#FFFFFF' }
];

const Explorateur = () => {
  const [dailyChallenges, setDailyChallenges] = useState({});
  const [completed, setCompleted] = useState([]);
  const [dailyProgress, setDailyProgress] = useState({ date: "", count: 0 });
  const [unlockedRewards, setUnlockedRewards] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const navigate = useNavigate();

  // Vérifie si c'est un nouveau jour
  const isNewDay = (lastUpdated) => {
    if (!lastUpdated) return true;
    const now = new Date();
    const lastUpdateDate = new Date(lastUpdated);
    return (
      now.getDate() !== lastUpdateDate.getDate() ||
      now.getMonth() !== lastUpdateDate.getMonth() ||
      now.getFullYear() !== lastUpdateDate.getFullYear()
    );
  };

  // Génère de nouveaux défis
  const generateNewChallenges = () => {
    const newChallenges = {};
    Object.keys(CHALLENGES).forEach(category => {
      const randomIndex = Math.floor(Math.random() * CHALLENGES[category].length);
      newChallenges[category] = CHALLENGES[category][randomIndex];
    });
    return newChallenges;
  };

  // Gestion du flip des cartes
  const toggleFlip = (category) => {
    setFlippedCards(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Initialisation et vérification quotidienne
  useEffect(() => {
    const checkAndUpdateChallenges = () => {
      const today = new Date().toDateString();
      const savedData = JSON.parse(localStorage.getItem('challengeAppData')) || {};
      
      if (isNewDay(savedData.lastUpdated)) {
        const newChallenges = generateNewChallenges();
        const newData = {
          challenges: newChallenges,
          completed: [],
          progress: { date: today, count: 0 },
          rewardsUnlocked: false,
          lastUpdated: today
        };
        
        localStorage.setItem('challengeAppData', JSON.stringify(newData));
        setDailyChallenges(newChallenges);
        setCompleted([]);
        setDailyProgress({ date: today, count: 0 });
        setUnlockedRewards(false);
        setFlippedCards({});
        
        if (savedData.lastUpdated) {
          toast.info("🎉 Nouveaux défis disponibles pour aujourd'hui !");
        }
      } else {
        setDailyChallenges(savedData.challenges || {});
        setCompleted(savedData.completed || []);
        setDailyProgress(savedData.progress || { date: "", count: 0 });
        setUnlockedRewards(savedData.rewardsUnlocked || false);
      }
    };

    // Vérifier immédiatement
    checkAndUpdateChallenges();
    
    // Configurer une vérification périodique (toutes les minutes)
    const interval = setInterval(checkAndUpdateChallenges, 60000);
    
    // Vérification de la taille de l'écran
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Connexion utilisateur
    setIsLoggedIn(!!localStorage.getItem('authToken'));
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Compléter un défi
  const completeChallenge = (category, challenge, e) => {
    e.stopPropagation();
    const today = new Date().toDateString();
    const challengeId = `${category}-${challenge.text}`;
    
    if (!completed.includes(challengeId)) {
      const newCompleted = [...completed, challengeId];
      const newCount = dailyProgress.count + 1;
      const rewardsUnlocked = newCount >= 4;
      
      const updatedData = {
        challenges: dailyChallenges,
        completed: newCompleted,
        progress: { date: today, count: newCount },
        rewardsUnlocked,
        lastUpdated: today
      };
      
      localStorage.setItem('challengeAppData', JSON.stringify(updatedData));
      
      setCompleted(newCompleted);
      setDailyProgress(prev => ({ ...prev, count: newCount }));
      
      toast.success(`Défi accompli ! ${challenge.emoji}`);
      triggerConfetti();
      
      if (rewardsUnlocked && !unlockedRewards) {
        setUnlockedRewards(true);
        toast.info("🎉 Vous avez débloqué vos récompenses quotidiennes !");
      }
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/auth');
    toast.info("Vous avez été déconnecté avec succès");
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120
      }
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#ff6f61", 
      minHeight: "100vh",
      overflowX: 'hidden',
      width: '100%',
      position: 'relative'
    }}>
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
      <div style={{
        width: "100%",
        height: "400px",
        overflow: "hidden"
      }}>
        <img
          src="/chal.webp" 
          alt="Bannière de défis"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center"
          }}
        />
      </div>

      {/* Contenu principal */}
      <Container style={{ 
        padding: "20px 15px",
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        <motion.h1
          className="text-center mb-4"
          style={{ 
            color: "#fff", 
            fontFamily: "'Comic Sans MS', cursive",
            fontSize: isSmallScreen ? "1.8rem" : "2.2rem"
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mes Défis Quotidiens
        </motion.h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="row justify-content-center"
          style={{ margin: '0 -8px', padding: '0 50px'  }}
        >
          {Object.keys(CHALLENGES).map((category, index) => {
            const challenge = dailyChallenges[category];
            if (!challenge) return null;
            
            const isCompleted = completed.includes(`${category}-${challenge.text}`);
            const color = CARD_COLORS[index % CARD_COLORS.length];
            const isFlipped = flippedCards[category];

            return (
              <motion.div
                key={category}
                className="col-sm-6 col-lg-3 mb-4"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                style={{ 
                  padding: '0 8px',
                  maxWidth: '100%'
                }}
              >
                <div 
                  className="h-100 d-flex flex-column p-3 position-relative"
                  style={{
                    border: `3px solid ${color.bg}`,
                    borderRadius: "15px",
                    backgroundColor: isFlipped ? `${color.bg}20` : color.bg,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.6s ease",
                    transformStyle: "preserve-3d",
                    minHeight: "250px",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}
                  onClick={() => toggleFlip(category)}
                >
                  {/* Face avant */}
                  <div style={{
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "15px",
                    transform: "rotateY(0deg)"
                  }}>
                    <div style={{ fontSize: "2.2rem", marginBottom: "15px" }}>
                      {category === "DefiDuJour" && "☀️"}
                      {category === "DefiSurprise" && "🎁"}
                      {category === "RouletteDesDefis" && "🎡"}
                      {category === "DefiItem" && "🎨"}
                    </div>
                    <h3 
                      style={{ 
                        color: color.text,
                        fontFamily: "'Comic Sans MS', cursive",
                        fontSize: "1rem",
                        textAlign: "center"
                      }}
                    >
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                  </div>
                  
                  {/* Face arrière */}
                  <div style={{
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    transform: "rotateY(180deg)"
                  }}>
                    <div style={{ fontSize: "2.2rem" }}>
                      {category === "DefiDuJour" ? "☀️" : 
                       category === "DefiSurprise" ? "🎁" :
                       category === "RouletteDesDefis" ? "🎡" : "🎨"}
                    </div>

                    <h3 
                      style={{ 
                        color: color.text,
                        fontFamily: "'Comic Sans MS', cursive",
                        fontSize: "1rem",
                        textAlign: "center"
                      }}
                    >
                      {challenge.text} {challenge.emoji}
                    </h3>
                    
                    <motion.button
                      style={{ 
                        backgroundColor: color.bg,
                        color: color.text,
                        border: "none",
                        borderRadius: "20px",
                        padding: "8px 20px",
                        fontWeight: "bold",
                        width: "90%",
                        maxWidth: "180px",
                        margin: "0 auto 10px",
                        fontSize: "0.9rem"
                      }}
                      whileHover={!isCompleted ? { scale: 1.03 } : {}}
                      whileTap={!isCompleted ? { scale: 0.98 } : {}}
                      onClick={(e) => completeChallenge(category, challenge, e)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? "Déjà accompli" : "Je relève le défi !"}
                    </motion.button>
                  </div>

                  {isCompleted && (
                    <FaCheck 
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "10px",
                        color: "#2a9d8f",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "3px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 2
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section Récompenses */}
        <motion.div
          className="mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ width: '100%' }}
        >
          <div className="d-flex align-items-center mb-3">
            <h2 style={{ 
              color: "#fff", 
              fontFamily: "'Comic Sans MS', cursive",
              marginRight: "10px",
              padding: '0 50px',
              fontSize: isSmallScreen ? "1.5rem" : "1.8rem"
            }}>
              Récompenses Débloquées
            </h2>
            {unlockedRewards ? (
              <FaUnlock style={{ color: "#4ECDC4", fontSize: "1.5rem" }} />
            ) : (
              <FaLock style={{ color: "#FF6B6B", fontSize: "1.5rem" }} />
            )}
          </div>

          {unlockedRewards ? (
            <>
              <div className="p-4 mb-4" style={{ 
                backgroundColor: "rgba(255,255,255,0.9)", 
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                margin: "0 50px"
              }}>
                <h3 className="text-center mb-3" style={{ color: "#ff6f61" }}>
                  Message Motivant
                </h3>
                <p className="text-center" style={{ fontSize: "1.1rem" }}>
                  {MOTIVATION.phrases[Math.floor(Math.random() * MOTIVATION.phrases.length)]}
                </p>
              </div>

              <div className="ratio ratio-16x9 mb-4" style={{ 
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                margin: "0 50px",
                 width: "calc(100% - 100px)"
              }}>
                <iframe 
                  src={MOTIVATION.videos[Math.floor(Math.random() * MOTIVATION.videos.length)]} 
                  title="Récompense motivationnelle"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              </div>

              <p className="text-center text-white" style={{ fontSize: "1.1rem" }}>
                Ces récompenses resteront disponibles jusqu'à demain !
              </p>
            </>
          ) : (
            <div className="p-4 text-center" style={{ 
              backgroundColor: "rgba(255,255,255,0.2)", 
              borderRadius: "15px",
              color: "#fff"
            }}>
              <p style={{ fontSize: "1.1rem", marginBottom: "0" }}>
                Complétez 4 défis pour débloquer vos récompenses quotidiennes !
              </p>
              <div className="d-flex justify-content-center align-items-center mt-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: dailyProgress.count > i ? "#4ECDC4" : "#fff",
                      margin: "0 5px",
                      border: "2px solid #fff"
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </Container>

      {/* Footer */}
      <footer className="py-4 mt-5" style={{ 
        backgroundColor: "#333",
        width: '100%'
      }}>
        <Container className="text-center">
          <div className="d-flex justify-content-center gap-4 mb-3">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                style={{ color: "#fff", fontSize: "1.3rem" }}
                whileHover={{ y: -3, color: "#4ECDC4" }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon />
              </motion.a>
            ))}
          </div>
          <p style={{ color: "#fff", marginBottom: "0", fontSize: "0.9rem" }}>
            © {new Date().getFullYear()} Challenge Master. Tous droits réservés.
          </p>
        </Container>
      </footer>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: 'auto', maxWidth: '100%' }}
      />
      
      {unlockedRewards && <Confetti recycle={false} numberOfPieces={500} />}

      <style>
        {`
       
          body {
            overflow-x: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default Explorateur;