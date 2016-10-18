const express = require('express');
const fetch = require('./fetch');
const fetchError = require('./error');

const router = express.Router();

router.get('/clear', function(req, res) {
  fetch.clearCache()
    .then(res.send.bind(res))
    .catch(fetchError(res));
});

module.exports = router;
