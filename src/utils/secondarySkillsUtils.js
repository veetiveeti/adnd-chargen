/**
 * Roll for a secondary skill
 */
export const rollSecondarySkill = (secondarySkillsTable) => {
  const roll = Math.floor(Math.random() * 100) + 1;
  
  const result = secondarySkillsTable.find(
    entry => roll >= entry.min && roll <= entry.max
  );
  
  if (!result) return null;
  
  // Handle the "roll twice" case
  if (result.skill === "Roll twice, ignoring this result hereafter") {
    const skills = [];
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    while (skills.length < 2 && attempts < maxAttempts) {
      attempts++;
      const reroll = Math.floor(Math.random() * 100) + 1;
      const rerollResult = secondarySkillsTable.find(
        entry => reroll >= entry.min && reroll <= entry.max
      );
      
      if (rerollResult && 
          rerollResult.skill !== "Roll twice, ignoring this result hereafter" &&
          !skills.includes(rerollResult.skill)) {
        skills.push(rerollResult.skill);
      }
    }
    
    return skills.length > 0 ? skills : ["No skill of measurable worth"];
  }
  
  return [result.skill];
};

