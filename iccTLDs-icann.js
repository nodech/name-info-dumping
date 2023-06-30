#!/usr/bin/env node
'use strict';

const fs = require('fs');

(async () => {
  const url = 'https://www.icann.org/resources/pages/string-evaluation-completion-2014-02-19-en';
  const icanres = await fetch(url);

  if (icanres.status !== 200)
    throw new Error('ICANN string evaluation page not found');

  const icanhtml = await icanres.text();
  const punymatch = icanhtml.matchAll(/xn--[a-zA-Z0-9]+/g);
  const matches = Array.from(punymatch).map(n => n[0].toLowerCase()).sort();

  fs.writeFileSync('./data/iccTLDs.txt', matches.join('\n') + '\n');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
