import React, { useMemo } from 'react';

const rollDice = (diceString) => {
  const [count, sides] = diceString.split('d').map(Number);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total * 10; // Multiply by 10 as per the requirement
};

const calculateConstitutionBonus = (constitutionScore) => {
  return Math.floor(constitutionScore / 3.5);
};

const CharacterDetails = ({ 
  tenPercentXPBonus, 
  hitDie,
  armor, 
  shield, 
  weapons, 
  weaponProficiency,
  newProficiency,
  penalty,
  alignment, 
  specialSkills, 
  selectedScores, 
  startingMoney,
  className,
  poisonSave,
  petrificationSave,
  rodSave,
  breathSave,
  spellSave,
  race,
  thiefSkills,
  turnUndead,
  racialSavingThrows
}) => {
  const getXPBonusStatus = () => {
    if (!tenPercentXPBonus || Object.keys(tenPercentXPBonus).length === 0) {
      return 'No bonus available';
    }
    
    const bonusEligibility = Object.entries(tenPercentXPBonus).map(([ability, requiredScore]) => {
      const selectedScore = parseInt(selectedScores[ability.toLowerCase()]);
      return selectedScore >= requiredScore ? 'Yes' : 'No';
    });

    return bonusEligibility.every(status => status === 'Yes') ? 'Yes' : 'No';
  };

  const generatedMoney = useMemo(() => rollDice(startingMoney), [startingMoney]);

  const getModifiedThiefSkill = (skillName, baseChance) => {
    if (!thiefSkills || !race) return null;

    const racialModifier = thiefSkills[skillName].modifier[race.toLowerCase()] || 0;
    const modifiedChance = baseChance + racialModifier;

    if (race === "Human") {
      return <span>{baseChance}%</span>;
    }

    return (
      <span>
        {modifiedChance}%
        <span style={{ color: 'rgb(85 85 85)', marginLeft: '0.5rem' }}>
          ({racialModifier > 0 ? '+' : ''}{racialModifier}% racial modifier included)
        </span>
      </span>
    );
  };

  const getModifiedSavingThrow = (saveName, baseValue) => {
    if (!racialSavingThrows) return baseValue;

    let bonus = 0;
    let bonusDescription = '';

    if (racialSavingThrows.magic && (saveName === 'rod' || saveName === 'spell')) {
      const constitutionBonus = calculateConstitutionBonus(selectedScores.constitution);
      bonus += constitutionBonus;
      bonusDescription += `+${constitutionBonus} from constitution`;
    }

    if (racialSavingThrows.poison && saveName === 'poison') {
      const constitutionBonus = calculateConstitutionBonus(selectedScores.constitution);
      bonus += constitutionBonus;
      bonusDescription += `${bonusDescription ? ', ' : ''}+${constitutionBonus} from constitution`;
    }

    const modifiedValue = baseValue - bonus; // Lower is better in AD&D

    if (bonus > 0) {
      return (
        <span>
          {baseValue}
          <span style={{ color: 'rgb(85 85 85)', marginLeft: '0.5rem' }}>
            ({modifiedValue} for {saveName === 'poison' ? 'poison' : 'magic'}, {bonusDescription})
          </span>
        </span>
      );
    } else {
      return <span>{baseValue}</span>;
    }
  };
  
  
  return (
    <section className="characterDetailsContainer">
      <h2>Class Details: {className}</h2>
      <dl
        className="characterDetails"
      >
        <div>
          <dt>10% XP bonus</dt>
          <dd>{getXPBonusStatus()}</dd>
        </div>

        <div>
          <dt>Hit Die</dt>
          <dd>{hitDie}</dd>
        </div>

        <div>
          <dt>Saving Throws</dt>
          <dd>
            <ul>
              <li>
                Paralyzation, Poison or Death Magic:{" "}
                {getModifiedSavingThrow("poison", poisonSave)}
              </li>
              <li>
                Petrification or Polymorph:{" "}
                {getModifiedSavingThrow("petrify", petrificationSave)}
              </li>
              <li>
                Rod, Staff or Wand: {getModifiedSavingThrow("rod", rodSave)}
              </li>
              <li>
                Breath Weapon: {getModifiedSavingThrow("breath", breathSave)}
              </li>
              <li>Spell: {getModifiedSavingThrow("spell", spellSave)}</li>
            </ul>
          </dd>
        </div>

        <div>
          <dt>Armor</dt>
          <dd>{armor}</dd>
        </div>

        <div>
          <dt>Shield</dt>
          <dd>{shield}</dd>
        </div>

        <div>
          <dt>Weapons</dt>
          <dd>{Array.isArray(weapons) ? weapons.join(", ") : weapons}</dd>
        </div>

        <div>
          <dt>Weapon Proficiency</dt>
          <dd>{weaponProficiency} weapons</dd>
          <dt>Non-proficiency Penalty</dt>
          <dd>{penalty}</dd>
          <dt>Added Proficiency in Weapons Per Level</dt>
          <dd>{newProficiency}</dd>
        </div>

        <div>
          <dt>Alignment</dt>
          <dd>{alignment}</dd>
        </div>

        <div>
          <dt>Special Skills</dt>
          <dd>
            <ul>
              {specialSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </dd>
        </div>

        <div>
          <dt>Starting Money</dt>
          <dd>{generatedMoney} gold pieces</dd>
        </div>

        {className.toLowerCase() === "thief" && thiefSkills && (
          <div>
            <dt>Thief Skills</dt>
            <dd>
              <ul>
                <li>
                  Pick Pockets:{" "}
                  {getModifiedThiefSkill(
                    "pickPockets",
                    thiefSkills.pickPockets.base
                  )}
                </li>
                <li>
                  Open Locks:{" "}
                  {getModifiedThiefSkill(
                    "openLocks",
                    thiefSkills.openLocks.base
                  )}
                </li>
                <li>
                  Find/Remove Traps:{" "}
                  {getModifiedThiefSkill(
                    "findRemoveTraps",
                    thiefSkills.findRemoveTraps.base
                  )}
                </li>
                <li>
                  Move Silently:{" "}
                  {getModifiedThiefSkill(
                    "moveSilently",
                    thiefSkills.moveSilently.base
                  )}
                </li>
                <li>
                  Hide in Shadows:{" "}
                  {getModifiedThiefSkill(
                    "hideInShadows",
                    thiefSkills.hideInShadows.base
                  )}
                </li>
                <li>
                  Hear Noise:{" "}
                  {getModifiedThiefSkill(
                    "hearNoise",
                    thiefSkills.hearNoise.base
                  )}
                </li>
                <li>
                  Climb Walls:{" "}
                  {getModifiedThiefSkill(
                    "climbWalls",
                    thiefSkills.climbWalls.base
                  )}
                </li>
                <li>
                  Read Languages: {thiefSkills.readLanguages ? "Yes" : "No"}
                </li>
              </ul>
            </dd>
          </div>
        )}

        {className.toLowerCase() === "monk" && thiefSkills && (
          <div>
            <dt>Thief Skills</dt>
            <dd>
              <ul>
                <li>
                  Pick Pockets:{" "}
                  {getModifiedThiefSkill(
                    "pickPockets",
                    thiefSkills.pickPockets.base
                  )}
                </li>
                <li>
                  Open Locks:{" "}
                  {getModifiedThiefSkill(
                    "openLocks",
                    thiefSkills.openLocks.base
                  )}
                </li>
                <li>
                  Find/Remove Traps:{" "}
                  {getModifiedThiefSkill(
                    "findRemoveTraps",
                    thiefSkills.findRemoveTraps.base
                  )}
                </li>
                <li>
                  Move Silently:{" "}
                  {getModifiedThiefSkill(
                    "moveSilently",
                    thiefSkills.moveSilently.base
                  )}
                </li>
                <li>
                  Hide in Shadows:{" "}
                  {getModifiedThiefSkill(
                    "hideInShadows",
                    thiefSkills.hideInShadows.base
                  )}
                </li>
                <li>
                  Hear Noise:{" "}
                  {getModifiedThiefSkill(
                    "hearNoise",
                    thiefSkills.hearNoise.base
                  )}
                </li>
                <li>
                  Climb Walls:{" "}
                  {getModifiedThiefSkill(
                    "climbWalls",
                    thiefSkills.climbWalls.base
                  )}
                </li>
              </ul>
            </dd>
          </div>
        )}

{className.toLowerCase() === "cleric" && turnUndead && (
          <div>
            <dt>Turn Undead</dt>
            <dd>
              <ul>
                <li>
                  Skeleton:{" "}
                  {
                    turnUndead.score.skeleton
                  }
                </li>
                <li>
                  Zombie:{" "}
                  {
                    turnUndead.score.zombie
                  }
                </li>
                <li>
                  Ghoul:{" "}
                  {
                    turnUndead.score.ghoul
                  }
                </li>
                <li>
                  Shadow:{" "}
                  {
                    turnUndead.score.shadow
                  }
                </li>
                <li>
                  Wight:{" "}
                  {
                    turnUndead.score.wight
                  }
                </li>
              </ul>
            </dd>
          </div>
        )}

      </dl>
    </section>
  );
};

export default CharacterDetails;