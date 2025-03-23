import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaTrophy, FaDice, FaStar, FaGift } from "react-icons/fa";

const Explorateur = () => {
  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh" }}>
      <Container className="py-5">
        <h1 className="text-center text-white display-4 mb-4">Explorer les Défis</h1>
        <Row>
          {/* Défi du Jour */}
          <Col md={3} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="card shadow h-100 border-primary">
                <div className="card-body text-center p-4">
                  <FaStar size={48} className="text-primary mb-3" />
                  <h5 className="card-title fw-bold text-primary">Défi du Jour</h5>
                  <p className="card-text text-muted">Accomplis le défi du jour pour gagner des points !</p>
                  <Link to="/defi-du-jour" className="btn btn-primary">Voir Défi</Link>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* Défi Surprise */}
          <Col md={3} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="card shadow h-100 border-warning">
                <div className="card-body text-center p-4">
                  <FaGift size={48} className="text-warning mb-3" />
                  <h5 className="card-title fw-bold text-warning">Défi Surprise</h5>
                  <p className="card-text text-muted">Un défi surprise t'attend, prêt à relever le challenge ?</p>
                  <Link to="/defi-surprise" className="btn btn-warning">Voir Défi</Link>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* Roulette des Défis */}
          <Col md={3} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="card shadow h-100 border-success">
                <div className="card-body text-center p-4">
                  <FaDice size={48} className="text-success mb-3" />
                  <h5 className="card-title fw-bold text-success">Roulette des Défis</h5>
                  <p className="card-text text-muted">Faites tourner la roulette et choisis ton défi !</p>
                  <Link to="/roulette" className="btn btn-success">Tourner Roulette</Link>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* Défi Item */}
          <Col md={3} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="card shadow h-100 border-info">
                <div className="card-body text-center p-4">
                  <FaTrophy size={48} className="text-info mb-3" />
                  <h5 className="card-title fw-bold text-info">Défi Item</h5>
                  <p className="card-text text-muted">Sélectionne un défi spécifique selon tes préférences.</p>
                  <Link to="/defi-item" className="btn btn-info">Voir Défi</Link>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Explorateur;
