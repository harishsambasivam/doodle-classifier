//creating byte arrays from binary files.
p5.prototype.registerPreloadMethod("loadBytes");

p5.prototype.loadBytes = function (file, callback) {
  let self = this;
  let data = {};
  let oReq = new XMLHttpRequest();
  oReq.open("GET", file, true);
  oReq.responseType = "arraybuffer";
  oReq.onload = function (oEvent) {
    let arrayBuffer = oReq.response;
    if (arrayBuffer) {
      data.bytes = new Uint8Array(arrayBuffer);
      if (callback) {
        callback(data);
      }
      self._decrementPreload();
    }
  };
  oReq.send(null);
  return data;
};
