'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/reset/:email', controller.resetPassword);
router.get('/email/:email', controller.getUserId);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/me', auth.isAuthenticated(), controller.updateMe);
router.put('/me/properties', auth.isAuthenticated(), controller.updateMyProperties);
router.head('/:username', controller.usernameExists);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', controller.show);
router.post('/', controller.create);

module.exports = router;
