const express = require('express');
const mime = require('mime-types');
const fetch = require('./fetch');
const fetchError = require('./error');

const router = express.Router();

router.get('/:uid', function(req, res) {
  fetch.getRefs(req.params.uid)
    .then(res.json.bind(res))
    .catch(fetchError(res));
});

router.put('/:uid', function(req, res) {
  fetch.setRefs(req.params.uid, req.body)
    .then(res.send.bind(res))
    .catch(fetchError(res));
});

router.get('/:uid/:repo/:path(*)', function(req, res) {
  fetch.fetch(req.params).then(function({content, ref}) {
    res.setHeader('Content-Type', mime.lookup(req.params.path));
    if (ref) { res.setHeader('ETag', ref); }
    res.send(content);
  }).catch(fetchError(res));
});

module.exports = router;
