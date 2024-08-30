import React, { useState, useEffect, useMemo } from 'react';
import CharacterDetails from './CharacterDetails';
import CharacterAbilities from './CharacterAbilities';
import RaceDetails from './RaceDetails';
import CasinoIcon from '@mui/icons-material/Casino';

const ABILITY_SCORES = ['strength', 'intelligence', 'wisdom', 'dexterity', 'constitution', 'charisma'];

const rollAbilityScores = () => (
    Array(6).fill().map(() => 
      Array(4).fill().map(() => Math.floor(Math.random() * 6) + 1)
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((a, b) => a + b, 0)
    )
  );

const CharacterCreation = ({ races, classes, abilityScores }) => {
    const [rolledScores, setRolledScores] = useState(Array(6).fill(0));
    const [animatingScores, setAnimatingScores] = useState(true);
    const [selectedScores, setSelectedScores] = useState(() => 
      Object.fromEntries(ABILITY_SCORES.map(ability => [ability, '']))
    );
    const [usedIndices, setUsedIndices] = useState(new Set());
    const [selectedRace, setSelectedRace] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
  
    useEffect(() => {
      let animationTimer;
      const animationDuration = 2000; // 2 seconds
      const intervalDuration = 50; // Update every 50ms
      const totalIterations = animationDuration / intervalDuration;
      let currentIteration = 0;
  
      const animate = () => {
        if (currentIteration < totalIterations) {
          setRolledScores(Array(6).fill().map(() => Math.floor(Math.random() * 13) + 6));
          currentIteration++;
          animationTimer = setTimeout(animate, intervalDuration);
        } else {
          const finalScores = rollAbilityScores();
          setRolledScores(finalScores);
          setAnimatingScores(false);
          // Reset used indices and selected scores when new scores are rolled
          setUsedIndices(new Set());
          setSelectedScores(Object.fromEntries(ABILITY_SCORES.map(ability => [ability, ''])));
        }
      };
  
      animate();
  
      return () => clearTimeout(animationTimer);
    }, []);
  
    useEffect(() => {
        setRolledScores(rollAbilityScores());
        setUsedIndices(new Set());
      }, []);

    useEffect(() => {
      setSelectedClass('')
    }, [selectedRace]);

  const availableClasses = useMemo(() => {
    if (!selectedRace || Object.values(selectedScores).some(score => score === '')) return [];

    return classes.filter(cls => {
      const meetsMinimumScores = Object.entries(cls.minimumAbilityScores)
        .every(([ability, minScore]) => parseInt(selectedScores[ability.toLowerCase()]) >= minScore);
      const className = cls.name.replace('-', '').toLowerCase();
      return meetsMinimumScores && races.find(race => race.name === selectedRace).classes[className];
    });
  }, [selectedRace, selectedScores, classes, races]);

  const handleScoreChange = (ability, value) => {
    const newScore = parseInt(value);
    setSelectedScores(prev => {
      const oldScore = prev[ability];
      if (oldScore !== '') {
        setUsedIndices(prevUsed => {
          const newUsed = new Set(prevUsed);
          const oldIndex = rolledScores.findIndex((score, index) => score === parseInt(oldScore) && newUsed.has(index));
          if (oldIndex !== -1) newUsed.delete(oldIndex);
          return newUsed;
        });
      }
      if (newScore && rolledScores.includes(newScore)) {
        const availableIndex = rolledScores.findIndex((score, index) => score === newScore && !usedIndices.has(index));
        if (availableIndex !== -1) {
          setUsedIndices(prevUsed => new Set(prevUsed).add(availableIndex));
        }
      }
      return { ...prev, [ability]: value };
    });
  };

  const selectedClassDetails = useMemo(() => {
    return classes.find(cls => cls.name === selectedClass);
  }, [selectedClass, classes]);

  const abilityDetails = useMemo(() => {
    if (Object.values(selectedScores).some(score => score === '')) return null;

    const getScoreDetails = (ability, score) => {
      const abilityData = abilityScores.find(a => a.name.toLowerCase() === ability);
      return abilityData.scores.find(s => s.score === parseInt(score)) || {};
    };

    return {
      strength: getScoreDetails('strength', selectedScores.strength),
      intelligence: getScoreDetails('intelligence', selectedScores.intelligence),
      wisdom: getScoreDetails('wisdom', selectedScores.wisdom),
      dexterity: getScoreDetails('dexterity', selectedScores.dexterity),
      constitution: getScoreDetails('constitution', selectedScores.constitution),
      charisma: getScoreDetails('charisma', selectedScores.charisma),
    };
  }, [selectedScores, abilityScores]);

  const selectedRaceDetails = useMemo(() => {
    return races.find(race => race.name === selectedRace);
}, [selectedRace, races]);

const adjustedScores = useMemo(() => {
    if (!selectedRaceDetails) return selectedScores;

    const adjusted = { ...selectedScores };
    if (selectedRaceDetails.bonus) {
        Object.entries(selectedRaceDetails.bonus).forEach(([ability, value]) => {
            if (adjusted[ability]) {
                adjusted[ability] = {
                    original: parseInt(adjusted[ability]),
                    adjusted: parseInt(adjusted[ability]) + value,
                    modifier: value
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
                    modifier: -value
                };
            }
        });
    }
    return adjusted;
}, [selectedScores, selectedRaceDetails]);

  return (
    <main className='mainContainer'>
      <h1 style={{textAlign: 'center'}}>AD&D 1st Edition Character Planner</h1>

      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h2 style={{marginBottom: 0}}>Rolled Ability Scores</h2>
        <p> <b>Method I:</b> 4d6 are rolled, and the lowest die is discarded. Arranged in the order the player desires. </p>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
          <CasinoIcon className={animatingScores ? 'rotate' : ''} />
          <div style={{display: 'flex', flexDirection: 'row',}}>
          {rolledScores.map((score, index) => (
            <p
              key={index}
              style={{
                color: usedIndices.has(index) ? "#c8c8c8" : "inherit",
                marginRight: "10px",
              }}
            >
              {score}
            </p>
          ))}
          </div>
          <CasinoIcon className={animatingScores ? 'rotate' : ''} />
        </div>
      </div>

      <hr style={{marginTop: '2rem', marginBottom: '2rem'}}/>

      <section className="abilityScoresSection">
        {ABILITY_SCORES.map((ability) => (
          <div key={ability} style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
            <label style={{lineHeight: 2}}>{ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
            <input
              type="number"
              value={selectedScores[ability]}
              onChange={(e) => handleScoreChange(ability, e.target.value)}
              style={{
                width: "60px",
                height: "60px",
                fontSize: "1.5rem",
                textAlign: "center"
              }}
            />
          </div>
        ))}
      </section>

      <div className="raceAndClassSelector">
        <section className="raceSection">
          <label>Race</label>
          <select
          className="raceSelector"
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
          >
            <option value="">Select a race</option>
            {races.map((race) => (
              <option key={race.name} value={race.name}>
                {race.name}
              </option>
            ))}
          </select>
        </section>

        <section className="classSection">
          <label>Class</label>
          <select
          className="classSelector"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={availableClasses.length === 0}
          >
            <option value="">Select a class</option>
            {availableClasses.map((cls) => (
              <option key={cls.name} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </section>
      </div>

      {selectedClass && selectedClassDetails && (
        <>
          <CharacterAbilities
            adjustedScores={adjustedScores}
            raceName={selectedRaceDetails.name}
            strScore={selectedScores.strength}
            strHitProbability={abilityDetails.strength.hitProbability}
            strDamageAdjustment={abilityDetails.strength.damageAdjustment}
            strWeightAllowance={abilityDetails.strength.weightAllowance}
            strOpenDoors={abilityDetails.strength.openDoors}
            strBendBars={abilityDetails.strength.bendBars}
            intScore={selectedScores.intelligence}
            intAdditionalLanguages={abilityDetails.intelligence.languages}
            intSpellLevelMax={abilityDetails.intelligence.spellLevelMax}
            intLearnSpells={abilityDetails.intelligence.learnSpells}
            intMaxSpellsPerLevel={abilityDetails.intelligence.maxSpellsPerLevel}
            wisScore={selectedScores.wisdom}
            wisMagicAdjustment={abilityDetails.wisdom.magicAdjustment}
            wisSpellFailure={abilityDetails.wisdom.spellFailure}
            wisBonusSpells={abilityDetails.wisdom.bonusSpells}
            dexScore={selectedScores.dexterity}
            dexMissileAdjustment={abilityDetails.dexterity.missileAdjustment}
            dexReactionAdjustment={abilityDetails.dexterity.reactionAdjustment}
            dexAcAdjustment={abilityDetails.dexterity.acAdjustment}
            conScore={selectedScores.constitution}
            conHitPointAdjustment={
              abilityDetails.constitution.hitPointAdjustment
            }
            conSystemShock={abilityDetails.constitution.systemShock}
            conResurrection={abilityDetails.constitution.resurrection}
            chaScore={selectedScores.charisma}
            chaMaxHenchman={abilityDetails.charisma.maxHenchman}
            chaLoyalty={abilityDetails.charisma.loyalty}
            chaReaction={abilityDetails.charisma.reaction}
          />

          <CharacterDetails
            tenPercentXPBonus={selectedClassDetails.tenPercentXpBonus}
            hitDie={selectedClassDetails.hitDie}
            poisonSave={selectedClassDetails.savingThrows.poison}
            petrificationSave={selectedClassDetails.savingThrows.petrify}
            rodSave={selectedClassDetails.savingThrows.rod}
            breathSave={selectedClassDetails.savingThrows.breath}
            spellSave={selectedClassDetails.savingThrows.spell}
            savingThrows={selectedClassDetails.savingThrows}
            armor={selectedClassDetails.armor}
            shield={selectedClassDetails.shield}
            weapons={selectedClassDetails.weapons}
            alignment={selectedClassDetails.alignment}
            specialSkills={selectedClassDetails.specialSkills}
            selectedScores={selectedScores}
            weaponProficiency={selectedClassDetails.weaponProficiency.score}
            penalty={selectedClassDetails.weaponProficiency.penalty}
            newProficiency={
              selectedClassDetails.weaponProficiency.newProficiency
            }
            startingMoney={selectedClassDetails.startingMoney}
            className={selectedClassDetails.name}
            race={selectedRace}
            thiefSkills={classes.find((c) => c.name === "Thief").thiefSkills}
            racialSavingThrows={
              races.find((r) => r.name === selectedRace).savingThrows
            }
            turnUndead={classes.find((c) => c.name === "Cleric").turnUndead}
          />

          <RaceDetails race={selectedRaceDetails} />
        </>
      )}
    </main>
  );
};

export default CharacterCreation;