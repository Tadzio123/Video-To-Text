const form = document.querySelector("form");
const inputFile = document.querySelector("#video");
const transcriptionElement = document.querySelector(".transcription");

const searchInput = document.querySelector("#search");
const notificationElement = document.querySelector(".notification");

const label = inputFile.nextElementSibling;
const labelValue = label.value;

let fetchStatus = "";

inputFile.addEventListener("change", (event) => {
  const fileName = event.target.files[0].name;

  if (fileName) {
    label.querySelector("span").innerHTML = fileName;
  } else {
    label.innerHTML = labelValue;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  notificationElement.innerHTML = "";
  transcriptionElement.innerHTML = "";

  const video = inputFile.files[0];

  sendVideo(video);
});

const sendVideo = async (video) => {
  const formData = new FormData();
  formData.append("video", video);
  try {
    notificationElement.innerHTML = "loading...";
    const response = await fetch(
      "https://transcription-generator.herokuapp.com/uploadvideo",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data) {
        throw new Error(data.message);
      }
      throw new Error("Something went wrong");
    }

    notificationElement.innerHTML = "";
    displayTranscription(data.transcription);
  } catch (error) {
    notificationElement.innerHTML = "Error: " + error.message;
  }
};

const displayTranscription = (transcription) => {
  const searchValue = searchInput.value;
  const words = transcription.split(" ");
  const matchedWords = words.map((word) => {
    if (word === searchValue.toLowerCase()) {
      return `<span class="match">${word.toLowerCase()}</span>`;
    }
    return word;
  });

  transcriptionElement.innerHTML = matchedWords.join(" ");
  searchInput.value = "";
  inputFile.value = "";
};
