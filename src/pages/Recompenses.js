import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Alert, Tab, Tabs } from 'react-bootstrap';
import { FaTrophy, FaLock, FaLockOpen, FaStar, FaCrown, FaCalendarAlt, FaSnowflake, FaSun, FaLeaf, FaBirthdayCake } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

// Configuration complète des récompenses
const REWARD_CONFIG = {
  levelRewards: [
    {
      level: 1,
      pointsRequired: 50,
      rewards: [
        { id: 'badge-1', name: 'Débutant Motivé', type: 'badge', icon: '🥉' },
        { id: 'trophy-1', name: 'Coupe en Bronze', type: 'trophy', icon: '🏆' },
        { id: "time-1", name: "Early Bird", type: "time", icon: "🐦" },
        { id: "custom-1", name: "Profil Coloré", type: "customization", icon: "🎨" },
      ]
    },
    {
      level: 2,
      pointsRequired: 100,
      rewards: [
        { id: "badge-2", name: "Productivité Confirmée", type: "badge", icon: "🥈" },
        { id: "habit-1", name: "Tâche Express", type: "habit", icon: "⚡" },
        { id: "custom-2", name: "Arrière-plan Animé", type: "customization", icon: "✨" },
        { id: "title-1", name: "Gourou des Tâches", type: "title", icon: "🧠" } 
      ]
    },
    {
      level: 3,
      pointsRequired: 200,
      rewards: [
        { id: "badge-3", name: "Maître de l'Organisation", type: "badge", icon: "🥇" },
        { id: "habit-2", name: "Streak Master", type: "habit", icon: "🔥" },
        { id: "fun-1", name: "Stickers Exclusifs", type: "fun", icon: "🖼️" },
        { id: "title-2", name: "Super Héros de la Productivité", type: "title", icon: "🦸" },
      ]
    },
    {
      level: 4,
      pointsRequired: 300,
      rewards: [
        { id: "badge-4", name: "Légende des To-Do Lists", type: "badge", icon: "🌟" },
        { id: "fun-2", name: "Mini-Jeu Débloqué", type: "fun", icon: "🎮" },
        { id: "fun-3", name: "Playlist Motivante", type: "fun", icon: "🎧" },
        { id: "title-3", name: "Maître Zen de l'Organisation", type: "title", icon: "🧘" },
      ],
      
    },
    {
      level: 5,
      pointsRequired: 500,
      rewards: [
        { id: "trophy-2", name: "Coupe en Or", type: "trophy", icon: "🏅" },
        { id: "custom-3", name: "Thème Arc-en-Ciel", type: "customization", icon: "🌈" },
        { id: "community-1", name: "Défi Créé à ton Nom", type: "community", icon: "📜" },
        { id: "secret-1", name: "Récompense Secrète", type: "secret", icon: "🎁" },
      ]
    },
    {
      level: 6,
      pointsRequired: 700,
      rewards: [
        { id: "badge-6", name: "Expert Productif", type: "badge", icon: "🏅" },
        { id: "custom-6", name: "Thème Diamant", type: "customization", icon: "💎" },
        { id: "special-2", name: "VIP", type: "exclusivité", icon: "🌟", unlockCondition: "admin" },
        { id: "special-3", name: "Surprise", type: "mystère", icon: "🎁", unlockCondition: "random" }
      ]
    },
    {
      level: 7,
      pointsRequired: 900,
      rewards: [
        { id: "trophy-7", name: "Coupe Platine", type: "trophy", icon: "🏆" },
        { id: "fun-7", name: "Mini-jeu Premium", type: "fun", icon: "🎮" },
        { id: "fun-game", name: "Chasseur de Tâches", type: "game", icon: "👾", unlockCondition: "weeklyTaskMaster" },
        { id: "fun-avatar", name: "Super Productif", type: "avatar", icon: "🦸", level: 5, evolution: true }
      ]
    },
    {
      level: 8,
      pointsRequired: 1000,
      rewards: [
        { id: "badge-8", name: "Légende Vivante", type: "badge", icon: "🦄" },
        { id: "secret-8", name: "Récompense Ultime", type: "secret", icon: "🔮" },
        { id: "fun-sound", name: "Maître des Fanfares", type: "audio", icon: "🎺", unlockCondition: "fiveRewards" },
        { id: "fun-anim", name: "Maître des Festivités", type: "fun", icon: "🎉", effect: "completionAnimations" }
      ]
    }
  ],
  weeklyChallenges: [
    { id: "weekly-1", name: "7 jours de productivité", type: "habitude", icon: <FaCalendarAlt />, pointsRequired: 7 }
  ],
  seasonalRewards: [
    { id: 'seasonal-1', name: 'Explorateur d\'Hiver', type: 'hiver', icon: <FaSnowflake />, season: 'winter' },
    { id: "seasonal-2", name: "Renouveau Printanier", type: "printemps", icon: "🌸", season: "spring" },
    { id: "seasonal-3", name: "Été Productif", type: "été", icon: <FaSun />, season: "summer" },
    { id: "seasonal-4", name: "Récolte Automnale", type: "automne", icon: <FaLeaf />, season: "autumn" }
  ],
  specialRewards: [
    { id: 'special-1', name: 'Anniversaire', type: 'événement', icon: <FaBirthdayCake />, unlockCondition: 'date' },
    { id: "special-2", name: "VIP", type: "exclusivité", icon: "🌟", unlockCondition: "admin" }
  ],
  motivationalMessages: [
    "Bravo ! Chaque défi te rapproche de ton objectif ! 🚀",
    "Tu es incroyable ! Continue sur cette lancée ! 💪",
    "Un pas de plus vers la victoire ! 🎯",
    "Les légendes ne s'arrêtent jamais ! 🏆",
    "Ta persévérance est exemplaire ! 🔥",
    "Chaque défi accompli est une victoire sur toi-même ! 👏",
    "Ne lâche rien, tu es sur la bonne voie ! 🌟",
    "La réussite est au bout du chemin, continue ! 🏅",
  ]
};

const Recompenses = () => {
  // État initial
  const initialState = {
    points: 0,
    rewards: [],
    unlockedLevels: [],
    unlockedWeekly: [],
    unlockedSeasonal: [],
    unlockedSpecial: [],
    currentStreak: 0
  };

  const [state, setState] = useState(initialState);
  const [showConfetti, setShowConfetti] = useState(false);
  const [randomMessage, setRandomMessage] = useState('');
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [activeTab, setActiveTab] = useState('niveaux');
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des données
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = JSON.parse(localStorage.getItem('userData') || '{}');
        const completeData = { ...initialState, ...savedData };
        
        // Validation des données
        completeData.rewards = Array.isArray(completeData.rewards) ? completeData.rewards : [];
        completeData.unlockedLevels = Array.isArray(completeData.unlockedLevels) ? completeData.unlockedLevels : [];
        completeData.unlockedWeekly = Array.isArray(completeData.unlockedWeekly) ? completeData.unlockedWeekly : [];
        completeData.unlockedSeasonal = Array.isArray(completeData.unlockedSeasonal) ? completeData.unlockedSeasonal : [];
        completeData.unlockedSpecial = Array.isArray(completeData.unlockedSpecial) ? completeData.unlockedSpecial : [];

        setState(completeData);
        checkForNewRewards(completeData);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    setRandomMessage(REWARD_CONFIG.motivationalMessages[
      Math.floor(Math.random() * REWARD_CONFIG.motivationalMessages.length)
    ]);
  }, []);

  // Sauvegarde des données
  const saveData = (newData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(newData));
      setState(newData);
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // Vérification des nouvelles récompenses
  const checkForNewRewards = (currentData) => {
    if (!REWARD_CONFIG.levelRewards) return;

    const newRewards = [];
    const updatedData = { ...currentData };

    REWARD_CONFIG.levelRewards.forEach(level => {
      if (!level || !level.pointsRequired) return;

      const hasLevel = updatedData.unlockedLevels.includes(level.level);
      const hasPoints = updatedData.points >= level.pointsRequired;

      if (hasPoints && !hasLevel) {
        updatedData.unlockedLevels.push(level.level);
        
        level.rewards?.forEach(reward => {
          if (reward && !updatedData.rewards.some(r => r.id === reward.id)) {
            const newReward = { 
              ...reward, 
              dateUnlocked: new Date().toISOString(),
              level: level.level
            };
            updatedData.rewards.push(newReward);
            newRewards.push(newReward);
          }
        });
      }
    });

    if (newRewards.length > 0) {
      saveData(updatedData);
      setNewlyUnlocked(newRewards);
      triggerConfetti();
      newRewards.forEach(reward => {
        showRewardNotification(reward);
      });
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const showRewardNotification = (reward) => {
    toast.success(`Récompense débloquée: ${reward.name} !`, {
      position: 'top-right',
      autoClose: 4000
    });
  };

  // Fonction pour débloquer une récompense manuellement
  const unlockReward = (reward, type) => {
    try {
      if (!reward || !reward.id) {
        toast.error("Récompense invalide");
        return;
      }

      if (state.rewards.some(r => r.id === reward.id)) {
        toast.info('Vous avez déjà cette récompense !');
        return;
      }

      const updatedData = { ...state };
      const newReward = {
        ...reward,
        dateUnlocked: new Date().toISOString(),
        rewardType: type
      };

      updatedData.rewards.push(newReward);
      
      switch (type) {
        case 'level':
          if (reward.level && !updatedData.unlockedLevels.includes(reward.level)) {
            updatedData.unlockedLevels.push(reward.level);
          }
          break;
        case 'weekly':
          if (!updatedData.unlockedWeekly.includes(reward.id)) {
            updatedData.unlockedWeekly.push(reward.id);
          }
          break;
        case 'seasonal':
          if (!updatedData.unlockedSeasonal.includes(reward.id)) {
            updatedData.unlockedSeasonal.push(reward.id);
          }
          break;
        case 'special':
          if (!updatedData.unlockedSpecial.includes(reward.id)) {
            updatedData.unlockedSpecial.push(reward.id);
          }
          break;
        default:
          console.warn("Type de récompense inconnu:", type);
      }

      saveData(updatedData);
      triggerConfetti();
      showRewardNotification(newReward);
      setNewlyUnlocked(prev => [...prev, newReward]);
    } catch (error) {
      console.error("Erreur lors du déblocage:", error);
      toast.error('Erreur lors du déblocage');
    }
  };

  // Calcul du niveau actuel
  const getCurrentLevel = () => {
    if (!REWARD_CONFIG.levelRewards) return 0;
    
    return REWARD_CONFIG.levelRewards.reduce((maxLevel, level) => {
      return (level && state.points >= level.pointsRequired) ? level.level : maxLevel;
    }, 0);
  };

  // Calcul de la progression vers le prochain niveau
  const getProgressToNextLevel = () => {
    try {
      const currentLevel = getCurrentLevel();
      
      if (!REWARD_CONFIG.levelRewards?.length) return 0;
      if (currentLevel >= REWARD_CONFIG.levelRewards.length) return 100;

      if (currentLevel === 0) {
        const firstLevel = REWARD_CONFIG.levelRewards[0];
        if (!firstLevel?.pointsRequired) return 0;
        return Math.min(100, (state.points / firstLevel.pointsRequired) * 100);
      }

      const currentLevelData = REWARD_CONFIG.levelRewards[currentLevel - 1];
      const nextLevelData = REWARD_CONFIG.levelRewards[currentLevel];

      if (!currentLevelData?.pointsRequired || !nextLevelData?.pointsRequired) return 0;

      const progress = ((state.points - currentLevelData.pointsRequired) / 
                      (nextLevelData.pointsRequired - currentLevelData.pointsRequired)) * 100;
      return Math.min(100, Math.max(0, progress));
    } catch (error) {
      console.error("Erreur dans getProgressToNextLevel:", error);
      return 0;
    }
  };

  // Composant de carte de récompense
  const RewardCard = ({ reward, type, pointsRequired, currentPoints }) => {
    if (!reward) return null;

    const isUnlocked = state.rewards.some(r => r.id === reward.id) || 
                      (type === 'level' && currentPoints >= pointsRequired);

    return (
      <Col md={3} className="mb-3">
        <Card className={`h-100 ${isUnlocked ? 'border-success' : 'border-secondary'}`}>
          <Card.Body className="text-center">
            <div className="display-4 mb-2">{reward.icon}</div>
            <h5>{reward.name}</h5>
            <p className="text-muted small">{reward.type}</p>
            
            {!isUnlocked && type === 'level' && (
              <div className="mb-2 small text-muted">
                Débloque à {pointsRequired} points
              </div>
            )}
            
            {isUnlocked ? (
              <Badge bg="success" className="w-100">
                <FaLockOpen className="me-1" /> Débloqué
              </Badge>
            ) : (
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => unlockReward(reward, type)}
                className="w-100"
                disabled={type === 'level' && currentPoints < pointsRequired}
              >
                <FaLock className="me-1" /> 
                {type === 'level' ? 'Débloque automatique' : 'Débloquer'}
              </Button>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  if (isLoading) {
    return <div className="text-center mt-5">Chargement en cours...</div>;
  }

  return (
    <Container className="py-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <ToastContainer />

      {/* En-tête */}
      <Card className="mb-4 text-center bg-light">
        <Card.Body>
          <h2>Vos Récompenses</h2>
          <div className="display-4 text-primary">{state.points} points</div>
          
          <div className="mt-3">
            <Badge bg="info" className="fs-5 mb-2">
              Niveau {getCurrentLevel()}
            </Badge>
            
            {getCurrentLevel() < REWARD_CONFIG.levelRewards?.length && (
              <div className="mt-2">
                <div className="mb-1">
                  Prochain niveau: {REWARD_CONFIG.levelRewards[getCurrentLevel()]?.pointsRequired || 0} points
                </div>
                <ProgressBar 
                  now={getProgressToNextLevel()} 
                  label={`${Math.round(getProgressToNextLevel())}%`} 
                  variant="success"
                  animated
                />
              </div>
            )}
          </div>

          {randomMessage && (
            <div className="mt-3 fs-5 text-muted">"{randomMessage}"</div>
          )}
        </Card.Body>
      </Card>

      {/* Nouvelles récompenses */}
      {newlyUnlocked.length > 0 && (
        <Alert variant="success" className="mb-4">
          <h4>🎉 Nouvelles récompenses !</h4>
          <ul>
            {newlyUnlocked.map(reward => (
              <li key={reward.id}>{reward.name}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Onglets */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="niveaux" title="Par Niveaux">
          <Card className="mt-3">
            <Card.Body>
              {REWARD_CONFIG.levelRewards?.map(level => (
                <div key={level.level} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                    <h4 className="mb-0">
                      Niveau {level.level} - {level.pointsRequired} points
                      {state.unlockedLevels.includes(level.level) && (
                        <Badge bg="success" className="ms-2">Débloqué</Badge>
                      )}
                    </h4>
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        {state.points >= level.pointsRequired ? '✅' : '🔒'}
                      </span>
                      <ProgressBar 
                        now={Math.min(100, (state.points / level.pointsRequired) * 100)} 
                        style={{ width: '150px', height: '10px' }}
                      />
                    </div>
                  </div>
                  <Row>
                    {level.rewards?.map(reward => (
                      <RewardCard 
                        key={reward.id} 
                        reward={reward} 
                        type="level"
                        pointsRequired={level.pointsRequired}
                        currentPoints={state.points}
                      />
                    ))}
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="hebdomadaires" title="Hebdomadaires">
          <Card className="mt-3">
            <Card.Body>
              <Row>
                {REWARD_CONFIG.weeklyChallenges?.map(reward => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    type="weekly"
                    currentPoints={state.currentStreak}
                  />
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="saisonnières" title="Saisonnières">
          <Card className="mt-3">
            <Card.Body>
              <Row>
                {REWARD_CONFIG.seasonalRewards?.map(reward => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    type="seasonal"
                  />
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="spéciales" title="Spéciales">
          <Card className="mt-3">
            <Card.Body>
              <Row>
                {REWARD_CONFIG.specialRewards?.map(reward => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    type="special"
                  />
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Bouton de test (optionnel) */}
      <Button 
        variant="warning" 
        onClick={() => setState(prev => ({ ...prev, points: 1000 }))}
        className="mt-3"
      >
        TEST: Définir 1000 points
      </Button>
    </Container>
  );
};

export default Recompenses;