const fs = require('fs');
const pathsGenerator = require("../assets/js/PathsGenerator");

pathsGenerator.generatePaths().then(paths => {
  fs.writeFileSync('paths.json', JSON.stringify(paths));
}).catch(console.error);
