import React  from 'react';

const modifierStyle = {
    color: 'rgb(85 85 85)',
    marginLeft: '0.5em'
};

const CharacterAbilities = ({
  strHitProbability,
  exceptionalStrength,
  strDamageAdjustment,
  strWeightAllowance,
  strOpenDoors,
  strBendBars,
  intAdditionalLanguages,
  intSpellLevelMax,
  intLearnSpells,
  intMaxSpellsPerLevel,
  wisMagicAdjustment,
  wisSpellFailure,
  wisBonusSpells,
  dexMissileAdjustment,
  dexReactionAdjustment,
  dexAcAdjustment,
  conHitPointAdjustment,
  conSystemShock,
  conResurrection,
  chaMaxHenchman,
  chaLoyalty,
  chaReaction,
  adjustedScores,
  raceName,
}) => {

  const renderScore = (ability) => {
    const score = adjustedScores[ability];
    if (typeof score === 'object') {
      return (
        <>
          {score.adjusted}
          <span style={modifierStyle}>
            (includes {score.modifier > 0 ? '+' : ''}{score.modifier} from {raceName})
          </span>
        </>
      );
    }
    if (ability === 'strength' && exceptionalStrength !== null) {
      return `18(${exceptionalStrength === 0 ? '00' : exceptionalStrength.toString().padStart(2, '0')})`;
    }
    return score;
  };

  const getExceptionalStrengthDetails = (strength, exceptionalStrength) => {
    if (parseInt(strength) !== 18 || exceptionalStrength === null) {
      return null;
    }

    const strengthData = [
      { min: 0, max: 50, hitProbability: "+1", damageAdjustment: "+3", weightAllowance: "1000", openDoors: "1-3", bendBars: "20%" },
      { min: 51, max: 75, hitProbability: "+2", damageAdjustment: "+3", weightAllowance: "1250", openDoors: "1-4", bendBars: "25%" },
      { min: 76, max: 90, hitProbability: "+2", damageAdjustment: "+4", weightAllowance: "1500", openDoors: "1-4", bendBars: "30%" },
      { min: 91, max: 99, hitProbability: "+2", damageAdjustment: "+5", weightAllowance: "2000", openDoors: "1-4(1)", bendBars: "35%" },
      { min: 100, max: 100, hitProbability: "+3", damageAdjustment: "+6", weightAllowance: "3000", openDoors: "1-5(2)", bendBars: "40%" }
    ];

    const exceptionalStrengthNum = exceptionalStrength === 0 ? 100 : exceptionalStrength;
    const result = strengthData.find(range => exceptionalStrengthNum >= range.min && exceptionalStrengthNum <= range.max);
    return result;
  };

  const exceptionalStrengthDetails = getExceptionalStrengthDetails(adjustedScores.strength, exceptionalStrength);

  const getStrengthValue = (key) => {
    if (exceptionalStrengthDetails) {
      return exceptionalStrengthDetails[key];
    }
    switch(key) {
      case 'hitProbability': return strHitProbability || '-';
      case 'damageAdjustment': return strDamageAdjustment || '-';
      case 'weightAllowance': return strWeightAllowance || '-';
      case 'openDoors': return strOpenDoors || '-';
      case 'bendBars': return strBendBars || '-';
      default: return '-';
    }
  };

  return (
    <section className="characterAbilitiesContainer">
      <h2>Character Abilities</h2>
      <dl className="characterAbilities">
        <div>
          <h3>Strength</h3>
          <hr />
          <div>
            <dt>Score</dt>
            <dd>{renderScore("strength")}</dd>
          </div>
          <div>
            <dt>Hit Probability</dt>
            <dd>{getStrengthValue('hitProbability')}</dd>
          </div>
          <div>
            <dt>Damage Adjustment</dt>
            <dd>{getStrengthValue('damageAdjustment')}</dd>
          </div>
          <div>
            <dt>Weight Allowance</dt>
            <dd>{getStrengthValue('weightAllowance')}</dd>
          </div>
          <div>
            <dt>Open Doors</dt>
            <dd>{getStrengthValue('openDoors')}</dd>
          </div>
          <div>
            <dt>Bend Bars</dt>
            <dd>{getStrengthValue('bendBars')}</dd>
          </div>
        </div>

        <div>
          <h3>Intelligence</h3>

          <hr />

          <dt>Score</dt>
          <dd>{renderScore("intelligence")}</dd>

          <dt>Additional Languages</dt>
          <dd>{intAdditionalLanguages}</dd>

          <dt>Max Spell Level</dt>
          <dd>{intSpellLevelMax}</dd>

          <dt>Spell Knowledge</dt>
          <dd>{intLearnSpells}</dd>

          <dt>Maximum Spells Per Level</dt>
          <dd>{intMaxSpellsPerLevel}</dd>
        </div>

        <div>
          <h3>Wisdom</h3>

          <hr />

          <dt>Score</dt>
          <dd>{renderScore("wisdom")}</dd>

          <dt>Magic Adjustment</dt>
          <dd>{wisMagicAdjustment}</dd>

          <dt>Spell Failure</dt>
          <dd>{wisSpellFailure}</dd>

          <dt>Bonus Spells</dt>
          <dd>{wisBonusSpells}</dd>
        </div>

        <div>
          <h3>Dexterity</h3>

          <hr />

          <dt>Score</dt>
          <dd>{renderScore("dexterity")}</dd>

          <dt>Missile Adjustment</dt>
          <dd>{dexMissileAdjustment}</dd>

          <dt>Reaction Adjustment</dt>
          <dd>{dexReactionAdjustment}</dd>

          <dt>Armor Class Adjustment</dt>
          <dd>{dexAcAdjustment}</dd>
        </div>

        <div>
          <h3>Constitution</h3>

          <hr />

          <dt>Score</dt>
          <dd>{renderScore("constitution")}</dd>

          <dt>Hit Point Adjustment</dt>
          <dd>{conHitPointAdjustment}</dd>

          <dt>System Shock Survival</dt>
          <dd>{conSystemShock}</dd>

          <dt>Resurrection Survival</dt>
          <dd>{conResurrection}</dd>
        </div>

        <div>
          <h3>Charisma</h3>

          <hr />

          <dt>Score</dt>
          <dd>{renderScore("charisma")}</dd>

          <dt>Max Henchman Amount</dt>
          <dd>{chaMaxHenchman}</dd>

          <dt>Loyalty Adjustment</dt>
          <dd>{chaLoyalty}</dd>

          <dt>Reaction Adjustment</dt>
          <dd>{chaReaction}</dd>
        </div>
      </dl>
    </section>
  );
};

export default CharacterAbilities;