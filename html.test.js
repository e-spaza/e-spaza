const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('HTML files in dist directory', () => {
  // Get all HTML files in dist directory
  const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'dist')).filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    test(`${file} has a title`, async () => {
      const html = fs.readFileSync(path.resolve(__dirname, 'dist', file), 'utf-8');
      const dom = new JSDOM(html);
      const title = dom.window.document.querySelector('title');

      expect(title).not.toBeNull();
      expect(title.textContent).not.toEqual('');
    });
  });
});