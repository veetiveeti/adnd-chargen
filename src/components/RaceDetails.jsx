import React from 'react';

const raceDetailsStyle = {
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  outline: '1px solid #c8c8c8',
  filter: 'drop-shadow(0 0 0.75rem #e0e0e0)'
};

const RaceDetails = ({ race }) => {
  if (!race) return null;

  return (
    <section style={raceDetailsStyle}>
      <h2>Race Details: {race.name}</h2>
      <dl
        className="raceDetails"
      >
        {race.languages && (
          <div>
            <dt>Languages</dt>
            <dd>{race.languages.join(", ")}</dd>
          </div>
        )}

        {race.bonus && (
          <div>
            <dt>Racial Bonuses</dt>
            <dd>
              <ul>
                {Object.entries(race.bonus).map(([ability, value]) => (
                  <li key={ability}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}: +
                    {value}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        {race.minus && (
          <div>
            <dt>Racial Penalties</dt>
            <dd>
            <ul>
                {Object.entries(race.minus).map(([ability, value]) => (
                  <li key={ability}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}: +
                    {value}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        {race.savingThrows && (
          <div>
            <dt>Saving Throws</dt>
            <dd>
              <ul>
                {Object.entries(race.savingThrows).map(
                  ([skill, description]) => (
                    <li key={skill}>{description}</li>
                  )
                )}
              </ul>
            </dd>
          </div>
        )}

        {race.specialSkills && (
          <div>
            <dt>Special Skills</dt>
            <dd>
              <ul>
                {Object.entries(race.specialSkills).map(
                  ([skill, description]) => (
                    <li key={skill}>{description}</li>
                  )
                )}
              </ul>
            </dd>
          </div>
        )}

        {!race.languages &&
          !race.bonus &&
          !race.minus &&
          !race.savingThrows &&
          !race.specialSkills && (
            <div>
              <dt>Special Notes</dt>
              <dd>
                Humans have no special racial abilities, penalties, or bonuses.
              </dd>
            </div>
          )}
      </dl>
    </section>
  );
};

export default RaceDetails;