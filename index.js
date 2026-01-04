const form = document.getElementById("wordForm");
const input = document.getElementById("wordInput");
const results = document.getElementById("results");
const error = document.getElementById("error");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const word = input.value.trim();
  results.innerHTML = "";
  error.textContent = "";

  if (word === "") {
    error.textContent = "Please enter a word.";
    return;
  }

  fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then(function (data) {
      displayData(data[0]);
    })
    .catch(function () {
      error.textContent = "Word not found. Try another word.";
    });
});

function displayData(data) {
  const meaning = data.meanings[0];
  const definition = meaning.definitions[0];

  const container = document.createElement("div");
  container.className = "word-card";

  container.innerHTML = `
    <h2>${data.word}</h2>
    <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
    <p><strong>Definition:</strong> ${definition.definition}</p>
    <p><strong>Example:</strong> ${definition.example || "No example available"}</p>
    <p><strong>Synonyms:</strong> ${
      definition.synonyms && definition.synonyms.length > 0
        ? definition.synonyms.join(", ")
        : "No synonyms available"
    }</p>
  `;

  if (data.phonetics[0] && data.phonetics[0].audio) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = data.phonetics[0].audio;
    container.appendChild(audio);
  }

  results.appendChild(container);
}
