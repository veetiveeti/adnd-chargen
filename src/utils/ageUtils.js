// Utility functions for age calculations

/**
 * Parse dice notation (e.g., "2d6", "3d4") and roll the dice
 */
export const rollDice = (diceNotation) => {
  const match = diceNotation.match(/(\d+)d(\d+)/);
  if (!match) return 0;
  
  const [, numDice, numSides] = match;
  const count = parseInt(numDice);
  const sides = parseInt(numSides);
  
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
};

/**
 * Calculate starting age based on race and class
 */
export const calculateStartingAge = (race, className, startingAges) => {
  const raceName = race.toLowerCase();
  const normalizedClass = className.toLowerCase();
  
  const raceAges = startingAges[raceName];
  if (!raceAges) return null;
  
  const ageData = raceAges[normalizedClass];
  if (!ageData) return null;
  
  const variableAge = rollDice(ageData.variable);
  return ageData.base + variableAge;
};

/**
 * Determine age category based on age and race
 */
export const getAgeCategory = (age, race, ageCategories) => {
  const raceName = race.toLowerCase();
  const raceCategories = ageCategories[raceName];
  
  if (!raceCategories) return null;
  
  for (const [category, range] of Object.entries(raceCategories)) {
    if (age >= range.min && age <= range.max) {
      return category;
    }
  }
  
  // If age exceeds venerable max, still return venerable
  return 'venerable';
};

/**
 * Get age category display name
 */
export const getAgeCategoryName = (category) => {
  const names = {
    youngAdult: 'Young Adult',
    mature: 'Mature',
    middleAged: 'Middle Aged',
    old: 'Old',
    venerable: 'Venerable'
  };
  return names[category] || category;
};

/**
 * Get ability score modifiers for an age category
 */
export const getAgeModifiers = (ageCategory, ageEffects) => {
  if (!ageCategory || !ageEffects[ageCategory]) {
    return {};
  }
  return ageEffects[ageCategory];
};

/**
 * Apply age modifiers to ability scores
 * Returns new scores with age adjustments applied
 */
export const applyAgeModifiers = (scores, ageModifiers, racialAdjustments = {}) => {
  const adjustedScores = { ...scores };
  const adjustments = {};
  
  // Apply age modifiers
  Object.entries(ageModifiers).forEach(([ability, modifier]) => {
    const currentScore = typeof adjustedScores[ability] === 'object' 
      ? adjustedScores[ability].adjusted 
      : parseInt(adjustedScores[ability]);
    
    if (!isNaN(currentScore)) {
      adjustments[ability] = modifier;
      
      // If score already has racial adjustments, we need to add age on top
      if (typeof adjustedScores[ability] === 'object') {
        adjustedScores[ability] = {
          ...adjustedScores[ability],
          ageAdjusted: currentScore + modifier,
          ageModifier: modifier
        };
      } else {
        adjustedScores[ability] = {
          original: parseInt(adjustedScores[ability]),
          ageAdjusted: currentScore + modifier,
          ageModifier: modifier
        };
      }
    }
  });
  
  return { adjustedScores, adjustments };
};

