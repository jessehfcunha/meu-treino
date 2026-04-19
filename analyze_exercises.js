const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'public', 'exercises.json');
const exercises = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const names = exercises.map(ex => ex.name);
const ids = exercises.map(ex => ex.id);

console.log("Total exercises:", exercises.length);
console.log("Sample names:", names.slice(0, 20));

const mobilityMatches = names.filter(n => n.toLowerCase().includes('mobil') || n.toLowerCase().includes('stretch'));
console.log("Mobility/Stretch matches:", mobilityMatches.slice(0, 20));
