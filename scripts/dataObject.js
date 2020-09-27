class dataObject {
  constructor(label) {
    this.label = label;
    this.totalData = [];
    this.trainingData = [];
    this.testingData = [];
    this.trainingLabels = [];
    this.testingLabels = [];
    this.data_proportion = 0.8;
  }

  get trainingData() {
    return this._trainingData;
  }
  get testingData() {
    return this._testingData;
  }
  get trainingLabels() {
    return this._trainingLabels;
  }
  get testingLabels() {
    return this._testingLabels;
  }

  set trainingData(data) {
    this._trainingData = data;
  }

  set testingData(data) {
    this._testingData = data;
  }

  set trainingLabels(data) {
    this._trainingLabels = data;
  }

  set testingLabels(data) {
    this._testingLabels = data;
  }

  loadBytesData() {
    let index = doodleLabelList.indexOf(this.label);
    let bytesObject = dataPreload[index];
    this.totalData = bytesObject.bytes;
  }

  splitData() {
    for (let i = 0; i < numberOfEachDoodle; i++) {
      let offset = i * dataLength;
      let threshold = floor(this.data_proportion * numberOfEachDoodle);
      if (i < threshold) {
        this.trainingData[i] = this.totalData.subarray(
          offset,
          offset + dataLength
        );
        this.trainingLabels[i] = this.label;
      } else {
        this.testingData[i - threshold] = this.totalData.subarray(
          offset,
          offset + dataLength
        );
        this.testingLabels[i - threshold] = this.label;
      }
    }
  }
}
