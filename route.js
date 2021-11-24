const router = require('express').Router();

router.use('/', require('@routes/index'));
//router.use('/users', require('@routes/accountbook/users'));

/* 가계부 */
router.use('/account', require('@routes/accountbook/account'));
router.use('/cate', require('@routes/accountbook/cate'));
router.use('/departure', require('@routes/accountbook/departure'));
router.use('/user', require('@routes/accountbook/user'));

/* 로또 관련*/
router.use('/lotto', require('@routes/lotto/index'));

module.exports = router;
