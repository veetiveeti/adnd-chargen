import React from 'react';

const modifierStyle = {
    color: 'rgb(85 85 85)',
    marginLeft: '0.5em'
};

const CharacterAbilities = ({
  strHitProbability,
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
        return score;
      };

  return (
    <section className="characterAbilitiesContainer">
      <h2>Character Abilities</h2>
      <dl className="characterAbilities">
        <div>
          <h3>Strength</h3>

          <hr />

          <div>
            <div>
              <dt>Score</dt>
              <dd>{renderScore("strength")}</dd>
            </div>
          </div>

          <div>
            <dt>Hit Probability</dt>
            <dd>{strHitProbability}</dd>
          </div>

          <div>
            <dt>Damage Adjustment</dt>
            <dd>{strDamageAdjustment}</dd>
          </div>

          <div>
            <dt>Weight Allowance</dt>
            <dd>{strWeightAllowance}</dd>
          </div>

          <div>
            <dt>Open Doors</dt>
            <dd>{strOpenDoors}</dd>
          </div>

          <div>
            <dt>Bend Bars</dt>
            <dd>{strBendBars}</dd>
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