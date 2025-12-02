import './App.css';
import AbilityScoreRoller from './components/AbilityScoreRoller';
import DarkModeToggle from './components/DarkModeToggle';

import races from './tables/races.json';
import classes from './tables/classes.json';
import abilityScores from './tables/abilityScores.json';

function App() {
  return (
    <>
      <DarkModeToggle />
      <AbilityScoreRoller races={races.races} classes={classes.classes} abilityScores={abilityScores.abilityScores} />
    </>
  );
}

export default App;
