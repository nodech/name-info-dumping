'use strict';

const fs = require('fs');

(async () => {
  const url = 'https://www.iana.org/domains/root/db';
  const ianares = await fetch(url);

  if (ianares.status !== 200)
    throw new Error('Could not fetch IANA database');

  const ianahtml = await ianares.text();

  const content = ianahtml.match(/<tbody>(.*?)<\/tbody>\s+<\/table>/ms)[1];

  const regex = /\s+<tr>\s+<td>\s+<span class="domain tld"><a href="(.*?)">(.*?)<\/a><\/span><\/td>\s+<td>(.*?)\<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>/mg;

  const res = content.matchAll(regex);
  const arr = Array.from(res).map((n) => {
    const trname = n[1].match(/^.*\/(.*?)\.html$/)[1];

    return {
      name: trname,
      namestr: n[2],
      type: n[3],
      owner: n[4]
    };
  });

  fs.writeFileSync('./data/iana-db.json', JSON.stringify(arr, null, 2));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
