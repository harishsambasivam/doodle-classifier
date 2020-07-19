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
    dataObjectsArray[i] = new dataObject(doodleLabelList[i]);
    dataObjectsArray[i].loadBytesData();
    dataObjectsArray[i].splitData();
  }

  for (let i = 0; i < dataObjectsArray.length; i++) {
    training_labels = training_labels.concat(
      dataObjectsArray[i].getTrainingLabels()
    );

    testing_labels = testing_labels.concat(
      dataObjectsArray[i].getTestingLabels()
    );

    training_data = training_data.concat(dataObjectsArray[i].getTrainingData());

    testing_data = testing_data.concat(dataObjectsArray[i].getTestingData());
  }
  // Log progress

  console.log("Done");
}
