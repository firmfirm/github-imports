const Promise = require("bluebird");
const GitHubApi = require("github");
const db = require("./db");
const org = require("./org");

const github = new GitHubApi();
github.authenticate({
  type: "token",
  token: process.env.GITHUB_TOKEN,
});

function latestVersion(params) {
  return Promise.fromCallback(function(callback) {
    return github.repos.getTags(params, callback);
  }).then(function(tags) {
    return tags.length > 0 ? tags[0].name : "master";
  });
}

function userRefsKey(uid) { return `refs-${uid}`; }
const cachePrefix = "cache-";
function cacheKey(repoId) { return `${cachePrefix}${repoId}`; }

module.exports.getRefs = function(uid) {
  return db.hgetallAsync(userRefsKey(uid));
};

module.exports.setRefs = function(uid, refs) {
  return db.hmsetAsync(userRefsKey(uid), refs);
};

module.exports.clearCache = function() {
  return db.keysAsync(`${cachePrefix}*`).then((cacheKeys) => {
    if (cacheKeys.length > 0) {
      return db.delAsync(cacheKeys);
    }
  });
};

module.exports.fetch = function({uid, repo, path}) {
  // Serve local files for development
  // const devImport = dev(repo, path);
  // if (devImport) {
  //   return Promise.resolve({
  //     content: devImport,
  //   });
  // }

  const owner = org(repo);
  const repoId = `${owner}/${repo}`;
  const refsKey = userRefsKey(uid);

  return db.hgetAsync(refsKey, repoId).then(function(storedVersion) {
    if (!!storedVersion) { return storedVersion; }
    const setVersion = (ref) => db.hsetAsync(refsKey, repoId, ref).then(() => ref);
    return latestVersion({owner, repo}).then(setVersion);
  }).then(function(ref) {
    const response = (content) => ({
      ref, content: Buffer.from(content, 'base64'),
    });
    const contentKey = cacheKey(`${repoId}/${path}/${ref}`);
    return db.getAsync(contentKey)
    .then(function(content) {
      if (!!content) { return response(content); }
      return github.repos.getContent({owner, repo, path, ref})
      .then((content) => content.content)
      .then((content) => db.setexAsync(contentKey, 24*60*60, content)
        .then(() => content)
        .then(response));
    }).catch(function(e) {
      return db.hdelAsync(refsKey, repoId).then(() => Promise.reject(e));
    });
  });
};
