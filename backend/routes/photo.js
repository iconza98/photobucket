const express = require('express');
const PhotoController = require('../controllers/photo');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const router = express.Router();



router.post('', checkAuth, extractFile, PhotoController.createPhoto);

router.put( '/:id', checkAuth, extractFile, PhotoController.updatePhoto);

router.get('', PhotoController.getPhotos);

router.get('/:id', PhotoController.getPhoto);

router.delete( '/:id', checkAuth, PhotoController.deletePhoto);

module.exports = router;
