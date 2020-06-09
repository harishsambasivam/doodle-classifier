// This program is highly inspired by the Doodle Classifier made by
// Daniel Shiffman in "The coding train" as part of his toy neural
// network library. This is the Tensorflow version of his work with
// some tweaks and modifications.

// https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/examples/doodle_classification


// Voodoo magic for creating byte arrays from binary files (Thx Dan).
p5.prototype.registerPreloadMethod('loadBytes');

p5.prototype.loadBytes = function(file, callback) {
  let self = this;
  let data = {};
  let oReq = new XMLHttpRequest();
  oReq.open("GET", file, true);
  oReq.responseType = "arraybuffer";
  oReq.onload = function(oEvent) {
    let arrayBuffer = oReq.response;
    if (arrayBuffer) {
      data.bytes = new Uint8Array(arrayBuffer);
      if (callback) {
        callback(data);
      }
      self._decrementPreload();
    }
  }
  oReq.send(null);
  return data;
}
