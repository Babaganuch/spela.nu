// Test script to verify all game files have valid syntax
const fs = require('fs');
const path = require('path');

console.log('Testing JavaScript syntax for all game files...\n');

// Test script.js
try {
    const scriptContent = fs.readFileSync('./script.js', 'utf8');
    new Function(scriptContent);
    console.log('✓ script.js: Valid syntax');
} catch (error) {
    console.log('✗ script.js: Syntax error -', error.message);
}

// Test all game files
const gamesDir = './games';
const gameFiles = fs.readdirSync(gamesDir).filter(f => f.endsWith('.js'));

console.log(`\nTesting ${gameFiles.length} game files:\n`);

let allValid = true;
for (const file of gameFiles) {
    try {
        const content = fs.readFileSync(path.join(gamesDir, file), 'utf8');
        new Function(content);
        console.log(`✓ ${file}: Valid syntax`);
    } catch (error) {
        console.log(`✗ ${file}: Syntax error - ${error.message}`);
        allValid = false;
    }
}

console.log('\n' + (allValid ? 'All files have valid syntax!' : 'Some files have syntax errors!'));
