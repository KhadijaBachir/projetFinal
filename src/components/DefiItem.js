import React from 'react';

const DefiItem = ({ defi }) => {
  return (
    <div className="defi-item">
      <h2>{defi.titre}</h2>
      <p>{defi.description}</p>
      <button>Accepter le défi</button>
    </div>
  );
};

export default DefiItem;
