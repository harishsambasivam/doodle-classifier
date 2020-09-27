const doodleLabelList = ["flower", "cat", "bird"];
// 28x28 images = 784 pixels.

// Data arrays

// train split
let training_data = [];
let training_labels = [];

// test split
let testing_data = [];
let testing_labels = [];

const dataLength = 784;

function prepareData(data, labels) {
  let doodles = [];
  let labelsData = [];
  let returnedTensors = [];

  for (let i = 0; i < data.length; i++) {
    let pixels = [];
    for (let j = 0; j < dataLength; j++) {
      pixels[j] = data[i][j] / 255;
    }
    doodles[i] = pixels;
    let doodleIndex = doodleLabelList.indexOf(labels[i]);
    labelsData[i] = doodleIndex;
  }

  xs = tf.tensor2d(doodles);
  let labelsTensor = tf.tensor1d(labelsData, "int32");
  ys = tf.oneHot(labelsTensor, doodleLabelList.length).cast("float32");
  labelsTensor.dispose();
  returnedTensors[0] = xs;
  returnedTensors[1] = ys;
  return returnedTensors;
}

function initializeData() {
  console.log("Initializing data");
  for (let i = 0; i < doodleLabelList.length; i++) {
    let label = doodleLabelList[i];
    dataObjectsArray[i] = new DataObject(label);
    dataObjectsArray[i].loadBytesData();
    dataObjectsArray[i].splitData();
  }

  for (let i = 0; i < dataObjectsArray.length; i++) {
    training_labels = training_labels.concat(
      dataObjectsArray[i].trainingLabels
    );
    testing_labels = testing_labels.concat(dataObjectsArray[i].trainingLabels);
    training_data = training_data.concat(dataObjectsArray[i].trainingData);
    testing_data = testing_data.concat(dataObjectsArray[i].testingData);
  }

  console.log("Done");
}
