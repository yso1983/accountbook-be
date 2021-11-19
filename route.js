const router = require('express').Router();

router.use('/', require('./routes/index'));
router.use('/users', require('./routes/users'));
router.use('/items', require('./routes/items'));
router.use('/lotto', require('./routes/lotto/index'));

module.exports = router;
