
// This program is highly inspired by the Doodle Classifier made by
// Daniel Shiffman in "The coding train" as part of his toy neural
// network library. This is the Tensorflow version of his work with
// some tweaks and modifications.

// https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/examples/doodle_classification


// Represents a data object that has a label
class dataObject {
  // Constructor that takes in the initial data and a label
  constructor(label){
    // Affect the members
    this.label = label;
    this.totalData = [];
    this.trainingData = [];
    this.testingData = [];
    this.trainingLabels = [];
    this.testingLabels = [];
  }

  // This method calls the loadBytes method for the correct label (binary file)
  loadBytesData(){
    // Let's see what's our index in the doodleLabelList
    let index = doodleLabelList.indexOf(this.label);
    // Let's gather our corresponding data preload
    let bytesObject = dataPreload[index];
    // Set the totalData as the bytes of this object
    this.totalData = bytesObject.bytes;
  }


  // This function splits the data array into testing and training data
  // Be aware that this is not the "training" and "testing" set of the model
  // per se, because TensorFlow already has that functionnality (see model.js).
  // In this specific case, the testing set is used for the UI to show the
  // accuracy of the model on data that he never saw.
  splitData(){
  
    // For all data (number of eachDoodles)
    for (let i = 0; i < numberOfEachDoodle; i++){
      // We need to make an offset because the data length is 784 (for each doodle)
      let offset = (i * dataLength);
      // You can change the "data_proportion" to change the % of training vs
      // testing data.
      let treshold = floor(data_proportion * numberOfEachDoodle);

      // Split the data using the treshold
      if (i < treshold){
        this.trainingData[i] = this.totalData.subarray(offset, offset + dataLength);
        this.trainingLabels[i] = this.label;
      } else {
        this.testingData[i - treshold] = this.totalData.subarray(offset, offset + dataLength);
        this.testingLabels[i - treshold] = this.label;
      }
    }
  }

  // Getters
  getTrainingData(){
    return this.trainingData;
  }
  getTestingData(){
    return this.testingData;
  }
  getTrainingLabels(){
    return this.trainingLabels;
  }
  getTestingLabels(){
    return this.testingLabels;
  }
}
