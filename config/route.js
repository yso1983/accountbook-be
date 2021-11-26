const router = require('express').Router();

router.use('/', require('@routes/index'));

/* 가계부 */
router.use('/account', require('@routes/accountbook/account'));
router.use('/cate', require('@routes/accountbook/cate'));
//router.use('/dnw', require('@routes/accountbook/dnw'));
router.use('/user', require('@routes/accountbook/user'));

/* 로또 관련*/
router.use('/lotto', require('@routes/lotto/index'));

module.exports = router;
