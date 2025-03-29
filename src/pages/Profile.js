import React, { useState, useEffect } from "react";
import { Container, Card, Image, Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaUserCircle, FaUpload, FaTrophy, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { 
  getUserData, 
  uploadProfilePhoto,
  onAuthStateChange,
  logoutUser
} from "../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (authUser) {
        const userUnsubscribe = getUserData(authUser.uid, (data) => {
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            ...data
          });
          setLoading(false);
        });
        return () => userUnsubscribe();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async () => {
    if (!profileImage || !user?.uid) return;
    
    setUploading(true);
    try {
      await uploadProfilePhoto(user.uid, profileImage);
      toast.success("Photo de profil mise à jour !");
      setProfileImage(null);
    } catch (error) {
      toast.error("Erreur lors de l'upload : " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur de déconnexion : " + error.message);
    }
  };

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" />
    </Container>
  );

  if (!user) return (
    <Container>
      <Alert variant="danger">Veuillez vous connecter pour accéder à votre profil</Alert>
    </Container>
  );

  return (
    <Container className="py-4">
      <ToastContainer />
      
      <Card className="mb-4">
        <Card.Body className="text-center">
          <div className="position-relative mb-3">
            {user.photoURL ? (
              <Image 
                src={user.photoURL} 
                roundedCircle 
                style={{ width: 150, height: 150, objectFit: 'cover' }}
                alt="Photo de profil"
              />
            ) : (
              <FaUserCircle size={150} className="text-secondary" />
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              style={{ display: 'none' }}
              id="profileUpload"
            />
            <Button
              variant="primary"
              size="sm"
              className="position-absolute bottom-0 end-0 rounded-circle"
              onClick={() => document.getElementById('profileUpload').click()}
              disabled={uploading}
            >
              <FaUpload />
            </Button>
          </div>

          {profileImage && (
            <div className="mb-3">
              <Button 
                variant="success" 
                onClick={handleImageUpload}
                disabled={uploading}
                className="me-2"
              >
                {uploading ? 'Envoi en cours...' : 'Enregistrer'}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => setProfileImage(null)}
                disabled={uploading}
              >
                Annuler
              </Button>
            </div>
          )}

          <h2>{user.name || 'Utilisateur'}</h2>
          <p className="text-muted">{user.email}</p>
          <div className="badge bg-primary fs-5 mb-3">
            {user.points || 0} points
          </div>
          <Button variant="danger" onClick={handleLogout}>
            <FaSignOutAlt /> Déconnexion
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <FaTrophy className="me-2" />
          Mes Récompenses
        </Card.Header>
        <Card.Body>
          {user.rewards?.length > 0 ? (
            <ul className="list-unstyled">
              {user.rewards.map((reward, i) => (
                <li key={i} className="mb-2 d-flex align-items-center">
                  <span className="fs-4 me-2">{reward.icon}</span>
                  <div>
                    <strong>{reward.name}</strong>
                    <div className="text-muted small">
                      Débloqué le {new Date(reward.dateUnlocked).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted">Aucune récompense encore</p>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <FaHistory className="me-2" />
          Historique des Défis
        </Card.Header>
        <Card.Body>
          {user.challengesState ? (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Défi</th>
                  <th>Date</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(user.challengesState)
                  .filter(([_, challenge]) => challenge.isCompleted)
                  .map(([id, challenge]) => (
                    <tr key={id}>
                      <td>{challenge.challengeName}</td>
                      <td>{new Date(challenge.completionDate).toLocaleDateString()}</td>
                      <td>+{challenge.points || 5}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted">Aucun défi complété</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;