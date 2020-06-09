
// This function create the xs and ys tensors from the data tables
function prepareData(data, labels){
  // Local arrays that will contain the data to be converted to tensors
  let doodles = [];
  let labelsData = [];
  // TODO: Return something that's less cancerous
  let returnedTensors = [];

  // For all doodles
  for (let i = 0; i < data.length; i++){
    // Let's create a pixel array to store each of them
    let pixels = [];
    // For all pixels in the Doodle
    for (let j = 0; j < dataLength; j++){
      // Let's add the pixel to the pixel array and normalize it (/255) to
      // get a value between 0 and 1.
      pixels[j] = data[i][j] / 255;
    }
    // Add the pixels of this doodle to the doodle array
    doodles[i] = pixels;

    // Let's look what's the doodleLabelList index of the label of this doodle
    let doodleIndex = doodleLabelList.indexOf(labels[i]);

    // Add this index to the labels array
    labelsData[i] = doodleIndex;
  }
  // Let's create the xs tensor with the doodles array
  xs = tf.tensor2d(doodles);
  // We need to use the "oneHot" function of tensorflow to process the labels
  let labelsTensor = tf.tensor1d(labelsData, 'int32');
  ys = tf.oneHot(labelsTensor, doodleLabelList.length).cast('float32');
  // Remove the labelsTensor (which was temporary) to avoid dataleaks
  labelsTensor.dispose();

  // Let's set the sourceXs and Ys for what we just created
  returnedTensors[0] = xs;
  returnedTensors[1] = ys;
  return returnedTensors;
}


// Concatenates all the training and testing labels/data
function initializeData(){
    // Log progress
    console.log("Initializing data");

    // For all doodles
    for(let i = 0; i < doodleLabelList.length; i++){
      // Create a dataObject for that doodle
      dataObjectsArray[i] = new dataObject(doodleLabelList[i]);
      dataObjectsArray[i].loadBytesData();
      dataObjectsArray[i].splitData();
    }

    // Let's merge all the arrays of the data objects into single ones

    // For all data objects
    for(let i = 0; i < dataObjectsArray.length; i++){
      // Concatenate the training labels
      training_labels = training_labels.
                          concat(dataObjectsArray[i].getTrainingLabels());

      // Same for the testing labels
      testing_labels = testing_labels.
                          concat(dataObjectsArray[i].getTestingLabels());

      // Same for the training data
      training_data = training_data.
                          concat(dataObjectsArray[i].getTrainingData());

      // Same for the testing data
      testing_data = testing_data.
                          concat(dataObjectsArray[i].getTestingData());
    }
    // Log progress
    
    console.log("Done");
}
