const fs = require('fs');

describe("Site generation status", () => {

  let paths = JSON.parse(fs.readFileSync('paths.json', 'utf8'));

  test.each(paths)('Path %s', (path) => {
    expect(fs.existsSync(`dist${path}index.html`)).toBeTruthy()
  });
});
