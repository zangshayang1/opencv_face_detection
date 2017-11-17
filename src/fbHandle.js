const utils = require('./utils.js');
const models = require('./models.js');

// preload the images and initialize the models before server starts
var raw_list = utils.loadImages();
models.initModels();

module.exports.handle = function(model, req, res) {
  var faceCascade;
  if (model == 'haar') {
    handleHaar(req, res);
  }
  else if (model == 'lbp') {
    handleLbp(req, res);
  }
  else if (model == 'dnn') {
    ;
  }
  else if (model == 'cool') {
    handleCool(req, res);
  }
  else {;}
}

handleHaar = function(req, res) {
  // prepare classifier
  faceCascade = models.loadClassifier('haar');
  var now = Date.now();
  let size = raw_list.length;
  for (var i = 0; i < size; ++i) {

    var dst = models.builtin_face_detection(faceCascade, raw_list[i]);
    var then = Date.now();

    if ((i + 1) % 10 == 0) { // reach the 10s point
      res.write(util.getOutout(then - now, i, size));
      now = then;
    }
  }
  if (then == now) {
    res.end();
  } else {
    res.end(util.getOutput(then - now, size - 1, size));
  }
  // detect and draw box around face
  // reformat output
  // var jpeg_data = utils.encode2image(dst);

  // response
  // res.end(jpeg_data.data);
}

handleLbp = function(req, res) {
  // prepare classifier
  faceCascade = models.loadClassifier('lbp');
  // detect and draw box around face
  var dst = models.builtin_face_detection(faceCascade, raw_list);
  // reformat output
  var jpeg_data = utils.encode2image(dst);
  // response
  res.end(jpeg_data.data);
}

handleDnn = function(req, res) {
  ;
}

handleCool = function(req, res) {
  var dst = models.contour(raw_list);
  var jpeg_data = utils.encode2image(dst);
  res.end(jpeg_data.data);
}
