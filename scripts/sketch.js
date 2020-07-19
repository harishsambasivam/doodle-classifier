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
  // For all doodles
  for (let i = 0; i < doodleLabelList.length; i++) {
    // Note the corresponding label
    let labelStr = doodleLabelList[i].toLowerCase();
    // Load the binary file associated with it
    dataPreload[i] = loadBytes("./datasets/" + labelStr + ".bin");
  }
  console.log("Done");
}

// Setup function of p5.js (called after preload)
async function setup() {
  // Let's create a 280 x 280 black interface (canvas)
  let canvas = createCanvas(280, 280);
  canvas.parent("sketch-holder");
  background(0);
  // Initialize the data (see "dataprep" for solid nightmares)
  initializeData();
  // Log progress
  console.log("Creating training tensors");
  // TODO: Something less cancerous
  // Let's create the training and testing tensors
  let rTensors = prepareData(training_data, training_labels);
  xs = rTensors[0];
  ys = rTensors[1];
  // Log progress
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
    // const saveResult = await model.save('indexeddb://my-model');
  });

  // const model =  await tf.loadModel('indexeddb://my-model');

  let guessButton = select("#guess");

  // Mouse pressed event of this guess button
  guessButton.mousePressed(function () {
    // Local variables
    let inputs = [];
    let inputImage = [];

    // Let's get all the pixels drawn on the canvas
    let img = get();
    // Let's resize the image as a 28x28 image (instead of 280x280 because
    // Mr NN has no freaking clue what is a 280x280 canvas).
    img.resize(28, 28);
    img.loadPixels();

    // For all pixels, let's flip the black to white and white to black (Mr NN
    // sees drawins as black on white instead of white on black)
    for (let i = 0; i < dataLength; i++) {
      // Btw, the *4 is because with p5.js, each pixel is divided into four
      // values: R, G, B and transparency. The 4th one is the only one we
      // actually want, since it's white on black
      let bright = img.pixels[i * 4];
      // Let's also normalize the pixels (machine learning stuff)
      inputs[i] = bright / 255.0;
    }
    // We need to create a 2D array with this pixel because the model has been
    // trained with 2D tensors.
    inputImage[0] = inputs;

    // Let's ask Mr. NN to predict what you have drawn!
    let tensorToPredict = tf.tensor2d(inputImage);
    console.log(tensorToPredict);
    // Let's see the probability vector that he processed
    let guess = model.predict(tensorToPredict);
    // Let's take the index with the highest probability
    let argMax = guess.argMax(1);
    // Let's wait for the GPU to give us the value back (dataSYNC)
    let index = argMax.dataSync()[0];

    // Alright, let's see what label this corresponds to!
    let classification = doodleLabelList[index];
    // What the AI thinks you draw is (drumroll)
    const output = select("#output");

    output.html(classification + "!!!");
    console.log("Guessed: " + classification);
  });

  // This button simply clears the canvas by making it all black.
  let clearButton = select("#clear");
  clearButton.mousePressed(function () {
    background(0);
  });

  // This button generates a drawing from the testing set so that you can
  // ask the AI to guess what he thinks it is (he's never seen it btw).
  let generateButton = select("#generate");

  generateButton.mousePressed(function () {
    // Reset the canvas
    background(0);

    // Let's generate a random index to go fetch the Doodle
    let randomIndex = floor(
      random(
        numberOfEachDoodle * doodleLabelList.length * (1 - data_proportion)
      )
    );
    // The random index needs to be 'Offset-ed' (yeah that's not a word) by
    // the length (in pixels) of the doodle so that it corresponds to the
    // beginning of the actual index'th doodle
    let offset = randomIndex * dataLength;

    // Let's store the pixels of that doodle in an array (use datasync for
    // promises and fun stuff like that)
    let doodlePixels = testing_xs
      .dataSync()
      .subarray(offset, offset + dataLength);

    // This offset corresponds to the fact that the label data is actually
    // a big array that contains a bunch of size 10 subarrays that contain
    // either 0 or 1 in each index that tells us wich index corresponds
    // to the doodle. That's what the "oneHot" vector does.
    let otherOffset = randomIndex * doodleLabelList.length;
    // Let's take the size 10 subarray of this Doodle index
    let labelsResult = testing_ys
      .dataSync()
      .subarray(otherOffset, otherOffset + doodleLabelList.length);
    // Now that we have the subarry, let's find which index equals 1
    let doodleIndex;
    // For all indexes
    for (let i = 0; i < labelsResult.length; i++) {
      // If the subarray index equals one, this is the one!
      if (labelsResult[i] === 1) {
        doodleIndex = i;
      }
    }
    // Let's log the string that corresponds to this index
    console.log(doodleLabelList[doodleIndex]);

    // Let's create the image of this bad boy
    let img = createImage(28, 28);
    // Let's load its pixels into the image
    img.loadPixels();

    // Let's draw the pixels correctly (as I said earlier, RGB + transparency)
    for (let i = 0; i < dataLength; i++) {
      let val = doodlePixels[i] * 255;
      img.pixels[i * 4 + 0] = val;
      img.pixels[i * 4 + 1] = val;
      img.pixels[i * 4 + 2] = val;
      img.pixels[i * 4 + 3] = 255;
    }
    // Update the pixels, resize the 28x28 for a 280x280 (that's why the
    // drawings are so darn horrible) and let's show this wonderful image.
    img.updatePixels();
    img.resize(280, 280);
    image(img, 0, 0);
  });
}

// Draw method (called non-stop by p5.js)
function draw() {
  // Let's put a 8 pixel wide stroke weight and set the color as white
  strokeWeight(8);
  stroke(255);

  // Each time this method is called (multiple times/second), it detects if
  // the mouse is pressed and draws a line if it's the case. Even though it's
  // a really tiny line, since it's called a bunch of times per second, this
  // actually makes a nice little drawing function!
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
