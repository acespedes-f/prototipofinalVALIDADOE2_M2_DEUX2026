import fs from 'node:fs';
import assert from 'node:assert/strict';
const js=fs.readFileSync(new URL('./app.js',import.meta.url),'utf8');
const data=fs.readFileSync(new URL('./data.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./styles.css',import.meta.url),'utf8');
assert.match(js,/function showTerritoryLoader\(\)/);
assert.match(js,/v512-loader-emblem/);
assert.match(js,/showMapIntro\(\)/);
assert.match(js,/applyMapTransform\(\);showTerritoryLoader\(\)/);
assert.doesNotMatch(js,/mapSymbolsMarkup\('v529-loader-symbols'\)/);
assert.match(js,/mapSymbolsMarkup\('v529-guide-symbols'\)/);
assert.match(css,/\.v512-territory-loading\{/);
// Each secondary step-advance in the scrollable panel was removed; the dock remains the only primary journey CTA.
assert.doesNotMatch(js,/class="v511-step-button" data-action="journey-go"/);
assert.doesNotMatch(js,/class="v511-secondary-step" data-action="journey-go"/);
assert.match(js,/class="v511-dock-cta" data-action="journey-go"/);
// Preserve event registration and map controls.
assert.match(js,/data-action="demo-enroll"/);
assert.match(js,/class="v518-process-card/);
assert.match(js,/class="v521-profile-card/);
assert.match(data,/Taller abierto de fibras y tramas/);
console.log('V5.31 OK: pantalla de carga restaurada sin figuras, guía modal exclusiva y CTA oscuro único para cada siguiente etapa.');
