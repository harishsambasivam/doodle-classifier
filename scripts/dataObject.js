class dataObject {
  constructor(label) {
    this.label = label;
    this.totalData = [];
    this.trainingData = [];
    this.testingData = [];
    this.trainingLabels = [];
    this.testingLabels = [];
  }

  loadBytesData() {
    let index = doodleLabelList.indexOf(this.label);
    let bytesObject = dataPreload[index];
    this.totalData = bytesObject.bytes;
  }

  splitData() {
    for (let i = 0; i < numberOfEachDoodle; i++) {
      let offset = i * dataLength;

      let treshold = floor(data_proportion * numberOfEachDoodle);

      if (i < treshold) {
        this.trainingData[i] = this.totalData.subarray(
          offset,
          offset + dataLength
        );
        this.trainingLabels[i] = this.label;
      } else {
        this.testingData[i - treshold] = this.totalData.subarray(
          offset,
          offset + dataLength
        );
        this.testingLabels[i - treshold] = this.label;
      }
    }
  }

  // Getters
  getTrainingData() {
    return this.trainingData;
  }
  getTestingData() {
    return this.testingData;
  }
  getTrainingLabels() {
    return this.trainingLabels;
  }
  getTestingLabels() {
    return this.testingLabels;
  }
}
