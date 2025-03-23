import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";

const RouletteDesDefis = ({ onDefiSelect }) => {
  const [defi, setDefi] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const tirerDefi = async () => {
    setIsSpinning(true);
    
    const defisSnapshot = await getDocs(collection(db, "defisBonus", "roulette", "défis"));
    const defis = defisSnapshot.docs.map(doc => doc.data());

    if (defis.length > 0) {
      const defiTire = defis[Math.floor(Math.random() * defis.length)];
      setTimeout(() => {
        setDefi(defiTire);
        setIsSpinning(false);
        onDefiSelect(defiTire);
      }, 2000);
    }
  };

  return (
    <div className="text-center">
      <motion.div 
        animate={{ rotate: isSpinning ? 360 : 0 }} 
        transition={{ duration: 2, ease: "easeInOut" }}
        className="roulette-wheel"
      >
        🎡
      </motion.div>
      <Button onClick={tirerDefi} className="mt-3">🎰 Tourner la Roulette</Button>
      {defi && <h4 className="mt-3">{defi.titre}</h4>}
    </div>
  );
};

export default RouletteDesDefis;
