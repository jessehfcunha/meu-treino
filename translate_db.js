const fs = require('fs');

async function translateText(text) {
    if (!text) return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0].map(item => item[0]).join('');
    } catch(e) {
        console.error("Translation error", e);
        return text;
    }
}

async function run() {
    const dbPath = 'public/database.json';
    const exercisesPath = 'public/exercises.json';
    
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const usedTerms = new Set();
    db.Treino.forEach(d => d.Exercicios.forEach(e => usedTerms.add(e.slug.toLowerCase().trim())));
    
    const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
    let changes = 0;
    
    for (const ex of exercises) {
        const term = ex.id.toLowerCase();
        const termFromName = ex.name.toLowerCase();
        
        let isUsed = false;
        usedTerms.forEach(t => {
            if (term === t || termFromName === t || termFromName.includes(t) || term.includes(t.replace(/ /g, '_'))) {
                isUsed = true;
            }
        });
        
        if (isUsed && ex.instructions && !ex.instructionsPT) {
            console.log("Translating:", ex.name);
            const translated = [];
            for (const text of ex.instructions) {
                const pt = await translateText(text);
                translated.push(pt);
                await new Promise(r => setTimeout(r, 300));
            }
            ex.instructionsPT = translated;
            changes++;
        }
    }
    
    if (changes > 0) {
        fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2));
        console.log("Finished writing to exercises.json");
    } else {
        console.log("No new translations needed.");
    }
}

run();
