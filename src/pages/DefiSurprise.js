import React, { useState } from "react";

const DefiSurprise = ({ onAccept }) => {
  const [defiSurprise, setDefiSurprise] = useState("Faire 20 squats 🏋️");

  const handleAccept = () => {
    onAccept(defiSurprise); // Transmet le défi surprise au parent
  };

  return (
    <div className="text-center">
      <h3>Défi Surprise</h3>
      <p>Défi surprise : {defiSurprise}</p>
      <button onClick={handleAccept} className="btn btn-primary">
        Accepter le défi
      </button>
    </div>
  );
};

export default DefiSurprise;