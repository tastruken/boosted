const fs = require('fs');

const sourceFile = 'portfolio-iq-facility-branding.html';
const targetFiles = [
  'portfolio-ulloa.html',
  'portfolio-eld.html',
  'portfolio-iq-facility.html',
  'portfolio-aros-del-pacifico.html',
  'portfolio-auditor-condominio.html',
  'portfolio-health-chile.html',
  'portfolio-instruvalve.html',
  'portfolio-trenton.html',
  'portfolio-ulloa-marketing.html'
];

const sourceContent = fs.readFileSync(sourceFile, 'utf8');

let cssStartIndex = sourceContent.indexOf('    /* Showcase Slider */');
if (cssStartIndex === -1) cssStartIndex = sourceContent.indexOf('    #portfolio-showcase {');

const cssEndMarker = '    .thumb img { width: 100%; height: 100%; object-fit: cover; }';
let cssEndIndex = sourceContent.indexOf(cssEndMarker);

if (cssStartIndex !== -1 && cssEndIndex !== -1) {
  cssEndIndex = sourceContent.indexOf('\n', cssEndIndex) + 1;
  const extractedCSS = sourceContent.substring(cssStartIndex, cssEndIndex);

  for (const file of targetFiles) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    let tStart = content.indexOf('    /* Showcase Slider */');
    if (tStart === -1) tStart = content.indexOf('    #portfolio-showcase {');
    let tEnd = content.indexOf(cssEndMarker);

    if (tStart !== -1 && tEnd !== -1) {
      tEnd = content.indexOf('\n', tEnd) + 1;
      content = content.substring(0, tStart) + extractedCSS + content.substring(tEnd);
      content = content.replace(/ *<div class="viewport-bg" id="viewportBg"><\/div>\n?/, '');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated', file);
    }
  }
} else {
  console.log('Could not extract CSS from source.');
}
