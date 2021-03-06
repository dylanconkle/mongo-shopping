var Item = require('../models/item');

exports.save = function(name, callback, errback) {
  Item.create({ name: name}, function(err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};

exports.list = function(callback, errback) {
  Item.find(function(err, items) {
    if (err) {
      errback(err);
      return;
    }
    callback(items);
  });
};

exports.delete = function(id, callback, errback) {
  Item.findByIdAndRemove(id, function(err){
    if (err) {
      errback(err);
      return;
    }
    callback();
  });
};

exports.update = function(id, name, callback, errback) {
  // Had to add new:true to options to return the new document rather than the original
  Item.findByIdAndUpdate(id, {$set: {name: name}}, {upsert: true, new: true}, function(err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};
