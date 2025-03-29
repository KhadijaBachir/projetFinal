import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { FaTrophy, FaMedal, FaGift, FaStar, FaCrown } from "react-icons/fa";
import { db, doc, onSnapshot, updateDoc,arrayUnion,auth} from "../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";

const Recompenses = () => {
  const [userData, setUserData] = useState({
    points: 0,
    rewards: []
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const userId = auth.currentUser?.uid;

  const rewardLevels = {
    beginner: [
      { id: "badge1", name: "Badge Débutant", points: 100, icon: <FaMedal /> },
      { id: "sticker1", name: "Autocollant", points: 150, icon: <FaStar /> }
    ],
    intermediate: [
      { id: "medal1", name: "Médaille Bronze", points: 300, icon: <FaMedal /> },
      { id: "gift1", name: "Cadeau", points: 400, icon: <FaGift /> }
    ],
    advanced: [
      { id: "trophy1", name: "Trophée Argent", points: 600, icon: <FaTrophy /> },
      { id: "crown1", name: "Couronne", points: 800, icon: <FaCrown /> }
    ]
  };

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData({
          points: data.points || 0,
          rewards: data.rewards || []
        });
      }
    });
  }, [userId]);

  const unlockReward = async (reward) => {
    try {
      const userRef = doc(db, "users", userId);
      
      await updateDoc(userRef, {
        rewards: arrayUnion({
          ...reward,
          dateUnlocked: new Date().toISOString()
        })
      });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(`Récompense "${reward.name}" débloquée !`);
    } catch (error) {
      toast.error("Erreur lors du déblocage");
    }
  };

  return (
    <Container className="py-4">
      {showConfetti && <Confetti />}
      <ToastContainer />

      <Card className="mb-4 text-center">
        <Card.Body>
          <h2>Vos Points</h2>
          <div className="display-4">{userData.points}</div>
        </Card.Body>
      </Card>

      {Object.entries(rewardLevels).map(([level, rewards]) => (
        <Card key={level} className="mb-4">
          <Card.Header>
            {level === 'beginner' && 'Niveau Débutant'}
            {level === 'intermediate' && 'Niveau Intermédiaire'}
            {level === 'advanced' && 'Niveau Avancé'}
          </Card.Header>
          <Card.Body>
            <Row>
              {rewards.map((reward) => {
                const isUnlocked = userData.rewards.some(r => r.id === reward.id);
                const canUnlock = userData.points >= reward.points && !isUnlocked;

                return (
                  <Col md={4} key={reward.id} className="mb-3">
                    <Card>
                      <Card.Body className="text-center">
                        <div className="display-4 text-warning">
                          {reward.icon}
                        </div>
                        <h5>{reward.name}</h5>
                        <p>{reward.points} points</p>
                        <Button
                          variant={isUnlocked ? "success" : canUnlock ? "primary" : "secondary"}
                          disabled={!canUnlock}
                          onClick={() => unlockReward(reward)}
                        >
                          {isUnlocked ? 'Débloqué' : 'Débloquer'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Recompenses;