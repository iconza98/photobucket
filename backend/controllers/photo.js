const PhotoModel = require('../models/photo');

exports.createPhoto = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');

  const photo = new PhotoModel({
    imagePath: url + '/images/' + req.file.filename
  });
  photo.save().then(createdPost => {
    res.status(201).json({
      message: 'Photo Added Successfully',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });
}

exports.updatePhoto = (req, res, next) => {
  let imagePath = req.body.imagePath;
  // checking if getting a file
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  console.log("IMAGE PATH:" + imagePath);
  const post = new PhotoModel({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  PhotoModel.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({ messge: "PUT Update Succesful!"})
  })
}

exports.getPhotos = (req, res, next) => {
  PhotoModel.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Posts fetched succesfully!',
        photos: documents
      });
    })
}

exports.getPhoto = (req, res, next) => {
  PhotoModel.findById(req.params.id).then( post=> {
    if( post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Photo not found!'
      });
    }
  })
}

exports.deletePhoto =  (req, res, next) => {
  PhotoModel.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({message: "Photo Deleted!"});
  });
}
