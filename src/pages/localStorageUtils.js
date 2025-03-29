// localStorageUtils.js

// Défis utilisateur
export const getUserChallenges = (category) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  return challenges.filter(challenge => challenge.category === category);
};

export const addUserChallenge = (challenge) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  const newChallenge = {
    ...challenge,
    id: `uc${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('userChallenges', JSON.stringify([...challenges, newChallenge]));
  return newChallenge.id;
};

export const deleteUserChallenge = (id) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  const updated = challenges.filter(c => c.id !== id);
  localStorage.setItem('userChallenges', JSON.stringify(updated));
};

// État des défis et progression
export const getChallengesState = () => {
  return JSON.parse(localStorage.getItem('challengesState')) || {};
};

export const updateChallengeState = (challengeId, updates) => {
  const state = getChallengesState();
  localStorage.setItem('challengesState', JSON.stringify({
    ...state,
    [challengeId]: {
      ...state[challengeId],
      ...updates,
      lastUpdated: new Date().toISOString()
    }
  }));
};

// Points et récompenses
export const getUserData = () => {
  return JSON.parse(localStorage.getItem('userData')) || {
    points: 0,
    rewards: [],
    completedChallenges: []
  };
};

export const updateUserPoints = (pointsToAdd) => {
  const userData = getUserData();
  const newPoints = userData.points + pointsToAdd;
  localStorage.setItem('userData', JSON.stringify({
    ...userData,
    points: newPoints
  }));
  return newPoints;
};

export const unlockReward = (reward) => {
  const userData = getUserData();
  localStorage.setItem('userData', JSON.stringify({
    ...userData,
    rewards: [...userData.rewards, {
      ...reward,
      dateUnlocked: new Date().toISOString()
    }]
  }));
};