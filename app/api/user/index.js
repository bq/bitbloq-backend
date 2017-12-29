'use strict';

var express = require('express');
var controller = require('./user.controller.js');
var auth = require('../../components/auth/auth.service');

var router = express.Router();

// DELETE
router.delete('/all', auth.hasRole('admin'), controller.deleteAll);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

// HEAD
router.head('/username/:username', controller.checkUsernameExists);
router.head('/email/:email', controller.checkEmailExists);
router.head('/:id/ban', auth.hasRole('admin'), controller.banUserInForum);
router.head('/:id/unban', auth.hasRole('admin'), controller.unbanUserInForum);

// GET
router.get('/email/:email', controller.getUserId);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/banned', controller.showBannedUsers);
router.get('/under14authorization/:token', controller.getUser);
router.get('/:id', controller.show);
router.get('/', auth.hasRole('admin'), controller.index);

// POST
router.post('/social', auth.getUser(), controller.socialLogin);
router.post('/forgot', controller.emailToken);
router.post('/all', auth.hasRole('admin'), controller.createAll);
router.post('/', controller.create);

// PUT
router.put('/me/password', auth.isAuthenticated(), controller.changePasswordAuthenticated);
router.put('/me/hardware', auth.isAuthenticated(), controller.addHardware);
router.put('/me', auth.isAuthenticated(), controller.updateMe);
router.put('/under14authorization', controller.authorizeUser);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/social', auth.isAuthenticated(), controller.turnToLocal);

// PATCH
router.patch('/under14authorization', auth.isAuthenticated(), controller.sendMailTutorAutorization);

module.exports = router;
