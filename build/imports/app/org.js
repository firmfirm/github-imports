const tester = (org, belongs) => (repo) => belongs(repo) ? org : false;
const byName = (org, repos) => tester(org, (repo) => repos.indexOf(repo) > -1);
const byPrefix = (org, prefixes) => tester(
  org, (repo) => prefixes.some((prefix) => repo.startsWith(prefix)));
const testers = [
  byName('Polymer', ['polymer', 'hydrolysis', 'web-component-tester']),
  byName('PolymerLabs', ['promise-polyfill']),
  byName('firebase', ['polymerfire', 'firebase']),
  byName('sjmiles', ['marked', 'prism', 'iron-component-page']),
  byName('firmfirm', [
    'promise-to-retry', 'cross-storage', 'plastik-regex-validator',
    'jwt-decode', 'flag-icon', 'iso639-js', 'dom-purify', 'dompurify',
  ]),
  byPrefix('webcomponents', ['webcomponents']),
  byPrefix('web-animations', ['web-animations-js']),
  byPrefix('GoogleWebComponents', ['google-']),
  byPrefix('firmfirm', ['f-', 'finterface-']),
  byPrefix('advancedkiosks', ['zamok-']),
  (repo) => 'PolymerElements'
];

module.exports = function(repo) {
  for (let i = 0; i < testers.length; i++) {
    let tester = testers[i];
    const org = tester(repo);
    if (org) {
      return org;
    }
  }
}
