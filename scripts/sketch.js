// 28x28 images = 784 pixels.
let dataLength = 784;

// Data arrays
let training_data = [];
let testing_data = [];
let training_labels = [];
let testing_labels = [];

// Contains all the data objects
let dataObjectsArray = [];

// Contains the arrays of preloaded data
let dataPreload = [];

// Model
let model;

// Tensors
xs = {};
ys = {};
testing_xs = {};
testing_ys = {};

function preload() {
  console.log("Preloading data");
  let filename;
  for (let i = 0; i < doodleLabelList.length; i++) {
    filename = doodleLabelList[i].toLowerCase();
    dataPreload[i] = loadBytes("./datasets/" + filename + ".bin");
  }
  console.log(dataPreload);
  console.log("Done");
}

// Setup function of p5.js (called after preload)
async function setup() {
  let canvas = createCanvas(280, 280);
  canvas.parent("canvas");
  background(0);
  initializeData();
  console.log("Creating training tensors");

  let rTensors = prepareData(training_data, training_labels);
  xs = rTensors[0];
  ys = rTensors[1];
  console.log("Done");
  console.log("Creating testing tensors");
  // TODO: Something less cancerous
  rTensors = prepareData(testing_data, testing_labels);
  testing_xs = rTensors[0];
  testing_ys = rTensors[1];
  // Log progress
  console.log("Done");
  // Log progress
  console.log("Creating model");
  // Let's build the model
  model = buildModel();
  // Log progress
  console.log("Done");

  // Log progress
  console.log("Training model");

  // Let's train the model (this .then(() => thingy is an application of the
  // new ES6 functionnality combined with the js promises).
  train().then(async () => {
    // Log progress
    console.log("Done");
    // const saveResult = await model.save("indexeddb://my-model");
  });

  // const model =  await tf.loadModel('indexeddb://my-model');

  let guessButton = select("#guess");

  guessButton.mousePressed(function () {
    let inputs = [];
    let inputImage = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    // Convert black in white drawings to white in black drawings(training doodles are white on black)
    for (let i = 0; i < dataLength; i++) {
      let alpha = img.pixels[i * 4];
      // normalize the pixels
      inputs[i] = alpha / 255.0;
    }
    // We need to create a 2D array with this pixel because the model has been
    // trained with 2D tensors.
    inputImage[0] = inputs;

    // convert array to tensor
    let tensorToPredict = tf.tensor2d(inputImage);
    console.log(tensorToPredict);
    //  predict the doodle
    let guess = model.predict(tensorToPredict);
    let argMax = guess.argMax(1);
    let classifiedLabel = argMax.dataSync()[0];

    let classifiedDoodleLabel = doodleLabelList[classifiedLabel];
    const output = select("#output");
    output.html(classifiedDoodleLabel + "!!!");
    console.log("Guessed: " + classifiedDoodleLabel);
  });

  let clearButton = select("#clear");
  clearButton.mousePressed(function () {
    background(0);
  });

  let generateButton = select("#generate");

  generateButton.mousePressed(function () {
    background(0);
    let randomIndex = floor(
      random(
        numberOfEachDoodle * doodleLabelList.length * (1 - data_proportion)
      )
    );
    let offset = randomIndex * dataLength;
    let doodlePixels = testing_xs
      .dataSync()
      .subarray(offset, offset + dataLength);
    let otherOffset = randomIndex * doodleLabelList.length;
    let labelsResult = testing_ys
      .dataSync()
      .subarray(otherOffset, otherOffset + doodleLabelList.length);
    let doodleIndex;
    for (let i = 0; i < labelsResult.length; i++) {
      if (labelsResult[i] === 1) {
        doodleIndex = i;
      }
    }
    console.log(doodleLabelList[doodleIndex]);
    let img = createImage(28, 28);
    img.loadPixels();
    for (let i = 0; i < dataLength; i++) {
      let val = doodlePixels[i] * 255;
      img.pixels[i * 4 + 0] = val;
      img.pixels[i * 4 + 1] = val;
      img.pixels[i * 4 + 2] = val;
      img.pixels[i * 4 + 3] = 255;
    }
    img.updatePixels();
    img.resize(280, 280);
    image(img, 0, 0);
  });
}

function draw() {
  strokeWeight(8);
  stroke(255);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
