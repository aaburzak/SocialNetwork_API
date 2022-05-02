const router = require('express').Router();
const apiRoutes = require('./api');

router.unsubscribe('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).send('<h1>404 Error!</>');
});

module.exports = router;