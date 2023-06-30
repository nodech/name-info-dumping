#!/usr/bin/env node
'use strict';

const fs = require('fs');

const examples = new Set([
  'xn--11b5bs1di'
]);

// https://en.wikipedia.org/wiki/Proposed_top-level_domain#Internationalized_country_code_top-level_domains
const more = new Set([
  'xn--wgv71a',
  'xn--vcst06ab2a',
  'xn--mgbb7fyab'
]);

(async () => {
  const url = 'https://www.icann.org/resources/pages/string-evaluation-completion-2014-02-19-en';
  const icanres = await fetch(url);

  if (icanres.status !== 200)
    throw new Error('ICANN string evaluation page not found');

  const icanhtml = await icanres.text();
  const punymatch = icanhtml.matchAll(/xn--[a-zA-Z0-9]+/g);
  const matches = Array.from(punymatch);

  const final = matches
      .map(n => n[0].toLowerCase())
      .filter(n => !examples.has(n))
      .concat(Array.from(more))
      .sort();

  fs.writeFileSync('./data/iccTLDs.txt', final.join('\n') + '\n');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
