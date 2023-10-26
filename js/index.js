const videoElem = document.getElementById("video");
const startShare = document.querySelector("#btn-share");
const startShareWebcam = document.querySelector("#btn-share-webcam");
const stopShare = document.querySelector("#btn-interrupt");
const startRecorder = document.querySelector("#btn-record");

const gdmOptions = {
  video: true,
  audio: true, // share or not audio
};

/* const gdmOptions = {
  video: {
    displaySurface: "window",
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
    suppressLocalAudioPlayback: true,
  },
  surfaceSwitching: "include",
  selfBrowserSurface: "exclude",
  systemAudio: "exclude",
}; */

async function startCapture(displayMediaOptions) {
  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

async function startCaptureWebcam(displayMediaOptions) {
  try {
    videoElem.srcObject = await navigator.mediaDevices.getUserMedia(
      displayMediaOptions
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

function stopCapture() {
  let tracks = videoElem.srcObject.getTracks();

  // Show Tracks
  // console.log({ tracks });

  tracks.forEach((track) => track.stop());
  videoElem.srcObject = null;
}

async function startRecord() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      mediaSource: "screen",
    },
  });
  const data = [];
  const mediaRecord = new MediaRecorder(stream);

  mediaRecord.ondataavailable = (e) => {
    data.push(e.data);
  };
  mediaRecord.start();
  mediaRecord.onstop = (e) => {
    videoElem.src = URL.createObjectURL(
      new Blob(data, {
        type: data[0].type,
      })
    );
  };
}

document.addEventListener("DOMContentLoaded", () => {
  startShare.addEventListener("click", () => startCapture(gdmOptions));
  startShareWebcam.addEventListener("click", () =>
    startCaptureWebcam(gdmOptions)
  );
  stopShare.addEventListener("click", () => stopCapture());
  startRecorder.addEventListener("click", () => startRecord());
});
