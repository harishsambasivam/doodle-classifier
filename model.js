



// This is the number of images of each doodle.bin file .
let numberOfEachDoodle = 1000;

// Doodle list 
let doodleLabelList = [
  'flower',
  'cat',
  'bird',
]

// Hidden layers

//const hiddenLayer1_Units = 512;  
const hiddenLayer2_Units = 256;
const hiddenLayer3_Units = 128;
const hiddenLayer4_Units = 64;
const hiddenLayers_Activation = "sigmoid";


// Output layer activation function
const outputLayer_Activation = "softmax";



// Model.compile (creates the model)
const model_LearningRate = 0.50;
const model_Optimizer = tf.train.adagrad(model_LearningRate);
const model_Loss = "meanSquaredError";


const training_DoShuffle = true;
const training_ValidationSplit = 0.2;
const training_BatchSize = 16;
const training_NumEpochs = 50;

// Training vs testing data FOR THE UI ONLY
const data_proportion = 0.8;


// Method that builds the model
function buildModel(){
  // Let's use the model type sequential for now
  let tempModel = tf.sequential();

  // Let's create the hidden layers of the model
  /*
  const hiddenLayer1 = tf.layers.dense({
    units: hiddenLayer1_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });
 */
  const hiddenLayer2 = tf.layers.dense({
    units: hiddenLayer2_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation
  });

  const hiddenLayer3 = tf.layers.dense({
    units: hiddenLayer3_Units,
    activation: hiddenLayers_Activation
  });

  const hiddenLayer4 = tf.layers.dense({
    units: hiddenLayer4_Units,
    activation: hiddenLayers_Activation
  });

  //output layer 
  const output = tf.layers.dense({
    units: doodleLabelList.length,
    activation: outputLayer_Activation
  })

 
  //tempModel.add(hiddenLayer1);
  tempModel.add(hiddenLayer2);
  tempModel.add(hiddenLayer3);
  tempModel.add(hiddenLayer4);
  tempModel.add(output);

  // Let's complile
  tempModel.compile({
    optimizer: model_Optimizer,
    loss: model_Loss,
    metrics: ['accuracy']
  })
  // Return the model!
  return tempModel;
}


async function train(){

  await model.fit(xs, ys, {
    // Training parameters (you set them earlier)
    shuffle: training_DoShuffle,
    validationSplit: training_ValidationSplit,
    batchSize: training_BatchSize,
    epochs: training_NumEpochs,
    // Training callbacks
    callbacks:{
      // When an epoch ends
      onEpochEnd: (epochs, logs) => {
        console.log('Epoch: ' + (epochs + 1));
        console.log('Loss: ' + logs.loss);
        console.log('Accuracy: ' + logs.acc.toFixed(2));
      }
    }
  });
}
