import React, { useState, useEffect, useMemo, useRef } from 'react';
import CharacterDetails from './CharacterDetails';
import CharacterAbilities from './CharacterAbilities';
import RaceDetails from './RaceDetails';
import CasinoIcon from '@mui/icons-material/Casino';
import Button from '@mui/material/Button';
import { 
  calculateStartingAge, 
  getAgeCategory, 
  getAgeCategoryName,
  getAgeModifiers 
} from '../utils/ageUtils';

const ABILITY_SCORES = ['strength', 'intelligence', 'wisdom', 'dexterity', 'constitution', 'charisma'];

// Method I: 4d6 drop lowest
const rollMethodI = () => (
  Array(6).fill().map(() => 
    Array(4).fill().map(() => Math.floor(Math.random() * 6) + 1)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a + b, 0)
  )
);

// Method II: Roll 3d6 twelve times, keep highest 6
const rollMethodII = () => {
  const rolls = Array(12).fill().map(() => 
    Array(3).fill().map(() => Math.floor(Math.random() * 6) + 1)
      .reduce((a, b) => a + b, 0)
  );
  return rolls.sort((a, b) => b - a).slice(0, 6);
};

// Method III: For each ability, roll 3d6 six times, keep highest
const rollMethodIII = () => {
  return Array(6).fill().map(() => {
    const rolls = Array(6).fill().map(() => 
      Array(3).fill().map(() => Math.floor(Math.random() * 6) + 1)
        .reduce((a, b) => a + b, 0)
    );
    return Math.max(...rolls);
  });
};

// Method IV: Generate 12 character sets
const rollMethodIV = () => {
  return Array(12).fill().map(() => 
    Array(6).fill().map(() => 
      Array(3).fill().map(() => Math.floor(Math.random() * 6) + 1)
        .reduce((a, b) => a + b, 0)
    )
  );
};

const rollExceptionalStrength = () => {
  const roll = Math.floor(Math.random() * 100) + 1;
  if (roll <= 50) return 50;
  if (roll <= 75) return 75;
  if (roll <= 90) return 90;
  if (roll <= 99) return 99;
  return 0; // represents 00
};

const CharacterCreation = ({ races, classes, abilityScores, agesData }) => {
  const isInitialMount = useRef(true);
  const characterAbilitiesRef = useRef(null);
  const [rollingMethod, setRollingMethod] = useState('1');
  const [rolledScores, setRolledScores] = useState(Array(6).fill(0));
  const [characterSets, setCharacterSets] = useState([]); // For Method IV
  const [selectedSetIndex, setSelectedSetIndex] = useState(null); // For Method IV
  const [animatingScores, setAnimatingScores] = useState(true);
  const [selectedScores, setSelectedScores] = useState(() => 
    Object.fromEntries(ABILITY_SCORES.map(ability => [ability, '']))
  );
  const [usedIndices, setUsedIndices] = useState(new Set());
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [exceptionalStrength, setExceptionalStrength] = useState(null);
  const [characterAge, setCharacterAge] = useState(null);
  const [ageCategory, setAgeCategory] = useState(null);

  const performRoll = (method) => {
    setAnimatingScores(true);
    setUsedIndices(new Set());
    setSelectedScores(Object.fromEntries(ABILITY_SCORES.map(ability => [ability, ''])));
    setSelectedSetIndex(null);
    
    const animationDuration = 2000;
    const intervalDuration = 50;
    const totalIterations = animationDuration / intervalDuration;
    let currentIteration = 0;

    const animate = () => {
      if (currentIteration < totalIterations) {
        if (method === '4') {
          // For Method IV, animate multiple character sets
          setCharacterSets(Array(12).fill().map(() => 
            Array(6).fill().map(() => Math.floor(Math.random() * 13) + 6)
          ));
        } else {
          setRolledScores(Array(6).fill().map(() => Math.floor(Math.random() * 13) + 6));
        }
        currentIteration++;
        setTimeout(animate, intervalDuration);
      } else {
        // Generate final rolls based on method
        if (method === '1') {
          setRolledScores(rollMethodI());
          setCharacterSets([]);
        } else if (method === '2') {
          setRolledScores(rollMethodII());
          setCharacterSets([]);
        } else if (method === '3') {
          const scores = rollMethodIII();
          setRolledScores(scores);
          // For Method III, auto-assign scores in order
          const autoAssigned = Object.fromEntries(
            ABILITY_SCORES.map((ability, index) => [ability, scores[index].toString()])
          );
          setSelectedScores(autoAssigned);
          setCharacterSets([]);
        } else if (method === '4') {
          setCharacterSets(rollMethodIV());
          setRolledScores([]);
        }
        setAnimatingScores(false);
      }
    };

    animate();
  };

  // Initial roll on component mount only
  useEffect(() => {
    const timer = setTimeout(() => {
      performRoll('1'); // Default to Method I on initial load
    }, 0);
    
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - only run once on mount

  useEffect(() => {
    setSelectedClass('')
  }, [selectedRace]);

  useEffect(() => {
    const eligibleClasses = ['Fighter', 'Ranger', 'Paladin'];
    if (selectedScores.strength === '18' && eligibleClasses.includes(selectedClass)) {
      setExceptionalStrength(rollExceptionalStrength());
    } else {
      setExceptionalStrength(null);
    }
  }, [selectedScores.strength, selectedClass]);

  // Reset everything when rolling method changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Clear all selections
    setSelectedScores(Object.fromEntries(ABILITY_SCORES.map(ability => [ability, ''])));
    setUsedIndices(new Set());
    setSelectedRace('');
    setSelectedClass('');
    setExceptionalStrength(null);
    setSelectedSetIndex(null);
    setRolledScores(Array(6).fill(0));
    setCharacterSets([]);
    
    // Automatically roll with the new method
    performRoll(rollingMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollingMethod]);

  // Scroll to Character Abilities when class is selected
  useEffect(() => {
    if (selectedClass && characterAbilitiesRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        characterAbilitiesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [selectedClass]);

  // Calculate age when race and class are selected
  useEffect(() => {
    if (selectedRace && selectedClass && agesData) {
      const age = calculateStartingAge(
        selectedRace, 
        selectedClass, 
        agesData.startingAges
      );
      
      if (age) {
        setCharacterAge(age);
        const category = getAgeCategory(age, selectedRace, agesData.ageCategories);
        setAgeCategory(category);
      }
    } else {
      setCharacterAge(null);
      setAgeCategory(null);
    }
  }, [selectedRace, selectedClass, agesData]);

  const availableClasses = useMemo(() => {
    if (
      !selectedRace ||
      Object.values(selectedScores).some((score) => score === "")
    )
      return [];

    return classes.filter((cls) => {
      const meetsMinimumScores = Object.entries(cls.minimumAbilityScores).every(
        ([ability, minScore]) =>
          parseInt(selectedScores[ability.toLowerCase()]) >= minScore
      );
      // Keep the hyphen to match the races.json format
      const className = cls.name.toLowerCase();
      return (
        meetsMinimumScores &&
        races.find((race) => race.name === selectedRace).classes[className]
      );
    });
  }, [selectedRace, selectedScores, classes, races]);

const handleScoreChange = (ability, value) => {
  // Methods III and IV have locked scores
  if (rollingMethod === '3' || rollingMethod === '4') {
    return; // Scores are not editable in these methods
  }
  
  // Update selected scores (for Methods I and II)
  setSelectedScores(prev => {
    const newScores = { ...prev, [ability]: value };
    
    // Recalculate usedIndices from scratch based on all selected scores
    // This avoids any closure/stale state issues
    const newUsedIndices = new Set();
    const availableIndices = [...rolledScores.keys()];
    
    // For each ability, find and mark the first available index with that score
    ABILITY_SCORES.forEach(abilityName => {
      const scoreValue = parseInt(newScores[abilityName]);
      if (scoreValue && !isNaN(scoreValue)) {
        const availableIndex = availableIndices.findIndex(idx => 
          rolledScores[idx] === scoreValue && !newUsedIndices.has(idx)
        );
        if (availableIndex !== -1) {
          newUsedIndices.add(availableIndices[availableIndex]);
        }
      }
    });
    
    setUsedIndices(newUsedIndices);
    return newScores;
  });
};

const handleMethodIVSelection = (setIndex) => {
  setSelectedSetIndex(setIndex);
  const selectedSet = characterSets[setIndex];
  const autoAssigned = Object.fromEntries(
    ABILITY_SCORES.map((ability, index) => [ability, selectedSet[index].toString()])
  );
  setSelectedScores(autoAssigned);
};

const selectedClassDetails = useMemo(() => {
  return classes.find(cls => cls.name === selectedClass);
}, [selectedClass, classes]);

const abilityDetails = useMemo(() => {
  if (Object.values(selectedScores).some(score => score === '')) return null;

  const getScoreDetails = (ability, score) => {
    const abilityData = abilityScores.find(a => a.name.toLowerCase() === ability);
    if (ability === 'strength' && parseInt(score) === 18 && exceptionalStrength !== null) {
      // Handle exceptional strength
      let exceptionalScore;
      if (exceptionalStrength === 0) {
        exceptionalScore = '18.00';
      } else if (exceptionalStrength <= 50) {
        exceptionalScore = '18.50';
      } else if (exceptionalStrength <= 75) {
        exceptionalScore = '18.75';
      } else if (exceptionalStrength <= 90) {
        exceptionalScore = '18.90';
      } else if (exceptionalStrength <= 99) {
        exceptionalScore = '18.99';
      } else {
        exceptionalScore = '18.00'; // This is for 100 roll
      }
      return abilityData.scores.find(s => s.score.toString() === exceptionalScore) || {};
    }
    return abilityData.scores.find(s => {
      const scoreValue = typeof s.score === 'string' ? s.score : s.score.toString();
      return scoreValue === score.toString();
    }) || {};
  };

  return {
    strength: getScoreDetails('strength', selectedScores.strength),
    intelligence: getScoreDetails('intelligence', selectedScores.intelligence),
    wisdom: getScoreDetails('wisdom', selectedScores.wisdom),
    dexterity: getScoreDetails('dexterity', selectedScores.dexterity),
    constitution: getScoreDetails('constitution', selectedScores.constitution),
    charisma: getScoreDetails('charisma', selectedScores.charisma),
  };
}, [selectedScores, abilityScores, exceptionalStrength]);

const selectedRaceDetails = useMemo(() => {
  return races.find(race => race.name === selectedRace);
}, [selectedRace, races]);

const adjustedScores = useMemo(() => {
  if (!selectedRaceDetails) return selectedScores;

  const adjusted = { ...selectedScores };
  
  // Apply racial modifiers first
  if (selectedRaceDetails.bonus) {
      Object.entries(selectedRaceDetails.bonus).forEach(([ability, value]) => {
          if (adjusted[ability]) {
              adjusted[ability] = {
                  original: parseInt(adjusted[ability]),
                  adjusted: parseInt(adjusted[ability]) + value,
                  racialModifier: value
              };
          }
      });
  }
  if (selectedRaceDetails.minus) {
      Object.entries(selectedRaceDetails.minus).forEach(([ability, value]) => {
          if (adjusted[ability]) {
              adjusted[ability] = {
                  original: parseInt(adjusted[ability]),
                  adjusted: parseInt(adjusted[ability]) - value,
                  racialModifier: -value
              };
          }
      });
  }
  
  // Apply age modifiers on top of racial modifiers
  if (ageCategory && agesData) {
    const ageModifiers = getAgeModifiers(ageCategory, agesData.ageEffects);
    
    Object.entries(ageModifiers).forEach(([ability, ageModifier]) => {
      if (adjusted[ability]) {
        const currentScore = typeof adjusted[ability] === 'object' 
          ? adjusted[ability].adjusted 
          : parseInt(adjusted[ability]);
        
        if (!isNaN(currentScore)) {
          if (typeof adjusted[ability] === 'object') {
            adjusted[ability] = {
              ...adjusted[ability],
              finalAdjusted: currentScore + ageModifier,
              ageModifier: ageModifier
            };
          } else {
            adjusted[ability] = {
              original: parseInt(adjusted[ability]),
              finalAdjusted: currentScore + ageModifier,
              ageModifier: ageModifier
            };
          }
        }
      }
    });
  }
  
  return adjusted;
}, [selectedScores, selectedRaceDetails, ageCategory, agesData]);

  // Check if all ability scores are filled
  const allScoresFilled = useMemo(() => {
    return Object.values(selectedScores).every(score => score !== '' && !isNaN(parseInt(score)));
  }, [selectedScores]);

  const methodDescriptions = {
    '1': '4d6 are rolled, and the lowest die is discarded. Arranged in the order the player desires.',
    '2': '3d6 are rolled 12 times and the highest 6 scores are retained. Arranged in the order the player desires.',
    '3': 'For each ability in order (STR, INT, WIS, DEX, CON, CHA), 3d6 are rolled 6 times and the highest score is retained. Scores cannot be rearranged.',
    '4': '3d6 are rolled to generate 6 ability scores for 12 complete characters. Select the set you prefer. Scores cannot be rearranged.'
  };

  return (
    <main className="mainContainer">
      <h1 style={{ textAlign: "center" }}>
        AD&D 1st Edition Character Helper
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem"
        }}
      >
        <div className="rollingMethodSelector">
          <label htmlFor="method-select"><b>Rolling Method:</b></label>
          <select
            id="method-select"
            value={rollingMethod}
            onChange={(e) => setRollingMethod(e.target.value)}
          >
            <option value="1">Method I</option>
            <option value="2">Method II</option>
            <option value="3">Method III</option>
            <option value="4">Method IV</option>
          </select>
          <Button
            variant="contained"
            onClick={() => performRoll(rollingMethod)}
            disabled={animatingScores}
            startIcon={<CasinoIcon />}
          >
            Roll Dice
          </Button>
        </div>
        <p style={{ textAlign: "center", maxWidth: "600px", margin: 0 }}>
          <b>Method {rollingMethod}:</b> {methodDescriptions[rollingMethod]}
        </p>
      </div>

      {rollingMethod !== '4' && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2 style={{ marginBottom: 0 }}>Rolled Ability Scores</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <CasinoIcon className={animatingScores ? "rotate" : ""} />
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
              {rolledScores.map((score, index) => (
                <p
                  key={index}
                  style={{
                    color: usedIndices.has(index) ? "var(--disabled-text)" : "inherit",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    opacity: usedIndices.has(index) ? 0.4 : 1
                  }}
                >
                  {score}
                </p>
              ))}
            </div>
            <CasinoIcon className={animatingScores ? "rotate" : ""} />
          </div>
        </div>
      )}

      {rollingMethod === '4' && (
        <div className="character-set-selection-container">
          <h2>Select a Character Set</h2>
          <p className="instruction-text">
            Click on a character set to select it
          </p>
          <div className="character-sets-grid">
            {characterSets.map((set, setIndex) => (
              <div
                key={setIndex}
                onClick={() => !animatingScores && handleMethodIVSelection(setIndex)}
                className={`character-set-card ${selectedSetIndex === setIndex ? 'selected' : ''} ${animatingScores ? 'disabled' : ''}`}
              >
                <h4>
                  Character {setIndex + 1}
                  {selectedSetIndex === setIndex && " ✓"}
                </h4>
                <div className="character-set-details">
                  {ABILITY_SCORES.map((ability, abilityIndex) => (
                    <div key={ability}>
                      <span>
                        {ability.slice(0, 3)}:
                      </span>
                      <span>{set[abilityIndex]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr style={{ marginTop: "2rem", marginBottom: "2rem" }} />

      {rollingMethod === '4' && selectedSetIndex === null && !animatingScores && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "var(--text-secondary)" }}>Please select a character set above to continue</p>
        </div>
      )}

      {(rollingMethod !== '4' || selectedSetIndex !== null) && (
        <section className="abilityScoresSection">
        {ABILITY_SCORES.map((ability) => (
          <div
            key={ability}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <label style={{ lineHeight: 2 }}>
              {ability.charAt(0).toUpperCase() + ability.slice(1).toLowerCase()}
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={selectedScores[ability]}
              onChange={(e) => handleScoreChange(ability, e.target.value)}
              readOnly={rollingMethod === '3' || rollingMethod === '4'}
              style={{
                width: "60px",
                height: "60px",
                fontSize: "1.5rem",
                textAlign: "center",
                borderRadius: "6px",
                cursor: (rollingMethod === '3' || rollingMethod === '4') ? "not-allowed" : "text"
              }}
            />
          </div>
        ))}
      </section>
      )}

      {(rollingMethod !== '4' || selectedSetIndex !== null) && (
      <div className="raceAndClassSelector">
        <section className="raceSection">
          <label>Race</label>
          <select
            className="raceSelector"
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
            disabled={!allScoresFilled}
            title={!allScoresFilled ? "Please fill in all ability scores first" : ""}
          >
            <option value="">Select a race</option>
            {races.map((race) => (
              <option key={race.name} value={race.name}>
                {race.name}
              </option>
            ))}
          </select>
          {!allScoresFilled && (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              Fill in all ability scores to select race
            </p>
          )}
        </section>

        <section className="classSection">
          <label>Class</label>
          <select
            className="classSelector"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={!allScoresFilled || availableClasses.length === 0}
            title={
              !allScoresFilled 
                ? "Please fill in all ability scores first" 
                : availableClasses.length === 0 
                  ? "Select a race first or ensure ability scores meet class requirements"
                  : ""
            }
          >
            <option value="">Select a class</option>
            {availableClasses.map((cls) => (
              <option key={cls.name} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
          {!allScoresFilled && (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              Fill in all ability scores to select class
            </p>
          )}
        </section>
      </div>
      )}

      {selectedClass && selectedClassDetails && (rollingMethod !== '4' || selectedSetIndex !== null) && (
        <div className="characterInfoContainer" ref={characterAbilitiesRef}>
          <CharacterAbilities
            adjustedScores={adjustedScores}
            raceName={selectedRaceDetails?.name}
            exceptionalStrength={exceptionalStrength}
            strScore={selectedScores.strength}
            strHitProbability={abilityDetails?.strength?.hitProbability}
            strDamageAdjustment={abilityDetails?.strength?.damageAdjustment}
            strWeightAllowance={abilityDetails?.strength?.weightAllowance}
            strOpenDoors={abilityDetails?.strength?.openDoors}
            strBendBars={abilityDetails?.strength?.bendBars}
            intScore={selectedScores.intelligence}
            intAdditionalLanguages={abilityDetails?.intelligence?.languages}
            intMinSpellsPerLevel={abilityDetails?.intelligence?.minSpellsPerLevel}
            intLearnSpells={abilityDetails?.intelligence?.learnSpells}
            intMaxSpellsPerLevel={abilityDetails?.intelligence?.maxSpellsPerLevel}
            wisScore={selectedScores.wisdom}
            wisMagicAdjustment={abilityDetails?.wisdom?.magicAdjustment}
            wisSpellFailure={abilityDetails?.wisdom?.spellFailure}
            wisBonusSpells={abilityDetails?.wisdom?.bonusSpells}
            dexScore={selectedScores.dexterity}
            dexMissileAdjustment={abilityDetails?.dexterity?.missileAdjustment}
            dexReactionAdjustment={abilityDetails?.dexterity?.reactionAdjustment}
            dexAcAdjustment={abilityDetails?.dexterity?.acAdjustment}
            conScore={selectedScores.constitution}
            conHitPointAdjustment={
              abilityDetails?.constitution?.hitPointAdjustment
            }
            conSystemShock={abilityDetails?.constitution?.systemShock}
            conResurrection={abilityDetails?.constitution?.resurrection}
            chaScore={selectedScores.charisma}
            chaMaxHenchman={abilityDetails?.charisma?.maxHenchman}
            chaLoyalty={abilityDetails?.charisma?.loyalty}
            chaReaction={abilityDetails?.charisma?.reaction}
            characterAge={characterAge}
            ageCategory={ageCategory}
            ageCategoryName={ageCategory ? getAgeCategoryName(ageCategory) : null}
            ageModifiers={ageCategory && agesData ? getAgeModifiers(ageCategory, agesData.ageEffects) : null}
          />

          <CharacterDetails
            tenPercentXPBonus={selectedClassDetails.tenPercentXpBonus}
            hitDie={selectedClassDetails.hitDie}
            poisonSave={selectedClassDetails.savingThrows?.poison}
            petrificationSave={selectedClassDetails.savingThrows?.petrify}
            rodSave={selectedClassDetails.savingThrows?.rod}
            breathSave={selectedClassDetails.savingThrows?.breath}
            spellSave={selectedClassDetails.savingThrows?.spell}
            savingThrows={selectedClassDetails.savingThrows}
            armor={selectedClassDetails.armor}
            shield={selectedClassDetails.shield}
            weapons={selectedClassDetails.weapons}
            alignment={selectedClassDetails.alignment}
            specialSkills={selectedClassDetails.specialSkills}
            selectedScores={selectedScores}
            weaponProficiency={selectedClassDetails.weaponProficiency?.score}
            penalty={selectedClassDetails.weaponProficiency?.penalty}
            newProficiency={
              selectedClassDetails.weaponProficiency?.newProficiency
            }
            startingMoney={selectedClassDetails.startingMoney}
            className={selectedClassDetails.name}
            race={selectedRace}
            thiefSkills={classes.find((c) => c.name === "Thief")?.thiefSkills}
            racialSavingThrows={
              races.find((r) => r.name === selectedRace)?.savingThrows
            }
            turnUndead={classes.find((c) => c.name === "Cleric")?.turnUndead}
          />

          <RaceDetails race={selectedRaceDetails} />
        </div>
      )}
    </main>
  );
};

export default CharacterCreation;