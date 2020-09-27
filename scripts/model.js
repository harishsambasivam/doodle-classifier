function buildModel() {
  let tempModel = tf.sequential();

  const hiddenLayer1_Units = 256;
  const hiddenLayers_Activation = "sigmoid";

  const hiddenLayer1 = tf.layers.dense({
    units: hiddenLayer1_Units,
    inputShape: dataLength,
    activation: hiddenLayers_Activation,
  });

  const hiddenLayer2_Units = 128;
  const hiddenLayer2 = tf.layers.dense({
    units: hiddenLayer2_Units,
    activation: hiddenLayers_Activation,
  });

  const hiddenLayer3_Units = 64;
  const hiddenLayer3 = tf.layers.dense({
    units: hiddenLayer3_Units,
    activation: hiddenLayers_Activation,
  });

  //output layer
  const outputLayer_Activation = "softmax";
  const output = tf.layers.dense({
    units: doodleLabelList.length,
    activation: outputLayer_Activation,
  });

  tempModel.add(hiddenLayer1);
  tempModel.add(hiddenLayer2);
  tempModel.add(hiddenLayer3);
  tempModel.add(output);

  const model_LearningRate = 0.5;
  const model_Optimizer = tf.train.adagrad(model_LearningRate);
  const model_Loss = "meanSquaredError";
  tempModel.compile({
    optimizer: model_Optimizer,
    loss: model_Loss,
    metrics: ["accuracy"],
  });
  return tempModel;
}

async function train() {
  const training_DoShuffle = true;
  const training_ValidationSplit = 0.2;
  const training_BatchSize = 16;
  const training_NumEpochs = 50;
  await model.fit(xs, ys, {
    shuffle: training_DoShuffle,
    validationSplit: training_ValidationSplit,
    batchSize: training_BatchSize,
    epochs: training_NumEpochs,
    callbacks: {
      onEpochEnd: (epochs, logs) => {
        console.log("Epoch: " + (epochs + 1));
        console.log("Loss: " + logs.loss);
        console.log("Accuracy: " + logs.acc.toFixed(2));
      },
    },
  });
}
