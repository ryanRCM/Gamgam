// Syntax-check the game's inline script: node tools/syntax.cjs
const fs = require('fs'), vm = require('vm'), path = require('path');
const s = fs.readFileSync(path.join(__dirname, '..', 'terminal', 'index.html'), 'utf8');
const b = s.match(/<script>([\s\S]*?)<\/script>/)[1];
try { new vm.Script(b, { filename: 'index.html#script' }); console.log('syntax ok'); } catch (e) { console.log(e.stack.split('\n').slice(0, 3).join('\n')); process.exit(1); }
