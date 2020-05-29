if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("registered serviceworker"))
    .catch((error) => console.log("error with register service worker", error));
}

var stream = null;
var canvas = null;
var context = null;
var player = null;
var playerIsPlaying = false;

function calculateSize(srcSize, dstSize) {
  var srcRatio = srcSize.width / srcSize.height;
  var dstRatio = dstSize.width / dstSize.height;
  if (dstRatio > srcRatio) {
    return {
      width: dstSize.height * srcRatio,
      height: dstSize.height,
    };
  } else {
    return {
      width: dstSize.width,
      height: dstSize.width / srcRatio,
    };
  }
}

async function startCameraFeed() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    playerIsPlaying = true;
    player = document.getElementById("pictureStream");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    player.srcObject = stream;
    player.addEventListener("loadedmetadata", () => {
      player.play();
    });
  } catch (error) {
    console.log(error);
  }
}
document.getElementById("cameraIcon").addEventListener("click", () => {
  if (playerIsPlaying == false) {
    document.getElementById("canvas").removeAttribute("data-caman-id");
    return;
  }
  // show still pic
  canvas.style.display = "flex";
  player.style.display = "none";

  var videoSize = { width: player.videoWidth, height: player.videoHeight };
  var canvasSize = { width: canvas.width, height: canvas.height };
  var renderSize = calculateSize(videoSize, canvasSize);
  var xOffset = (canvasSize.width - renderSize.width) / 2;
  context.drawImage(player, xOffset, 0, renderSize.width, renderSize.height);

  stream.getTracks().forEach((track) => track.stop());
  playerIsPlaying = false;
});

let brightnessSlider = document.getElementById("brightness");
let gammaSlider = document.getElementById("gamma");
let exposureSlider = document.getElementById("exposure");
let hueSlider = document.getElementById("hue");
let sepiaSlider = document.getElementById("sepia");

let brightness = 1;
let gamma = 1;
let exposure = 1;
let hue = 1;
let sepia = 1;

const clearImage = () => {
  Caman("#canvas", function () {
    this.reloadCanvasData();
  });
};
const updateImage = () => {
  Caman("#canvas", function () {
    this.revert(false);
    this.brightness(brightness);
    this.gamma(gamma);
    this.exposure(exposure);
    this.hue(hue);
    this.sepia(sepia);
    this.render();
  });
};

brightnessSlider.addEventListener(
  "input",
  () => {
    brightness = brightnessSlider.value;
    updateImage();
  },
  true
);

gammaSlider.addEventListener(
  "input",
  () => {
    gamma = gammaSlider.value;
    updateImage();
  },
  true
);

exposureSlider.addEventListener(
  "input",
  () => {
    exposure = exposureSlider.value;
    updateImage();
  },
  true
);

hueSlider.addEventListener(
  "input",
  () => {
    hue = hueSlider.value;
    updateImage();
  },
  true
);
sepiaSlider.addEventListener(
  "input",
  () => {
    sepia = sepiaSlider.value;
    updateImage();
  },
  true
);

startCameraFeed();
