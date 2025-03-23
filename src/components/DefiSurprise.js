import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "react-bootstrap";

const DefiSurprise = ({ onAccept }) => {
  const [defi, setDefi] = useState(null);

  useEffect(() => {
    const fetchDefiSurprise = async () => {
      const defisSnapshot = await getDocs(collection(db, "defisBonus", "surprise", "défis"));
      const defis = defisSnapshot.docs.map(doc => doc.data());

      if (defis.length > 0) {
        const defiTire = defis[Math.floor(Math.random() * defis.length)];
        setDefi(defiTire);
      }
    };

    fetchDefiSurprise();
  }, []);

  return defi ? (
    <div className="text-center">
      <h4>🎁 Défi Surprise !</h4>
      <p>{defi.titre}</p>
      <Button onClick={() => onAccept(defi)}>Accepter</Button>
    </div>
  ) : null;
};

export default DefiSurprise;

