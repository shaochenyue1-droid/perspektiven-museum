const WORDS = [
  { "id": 1, "word": "Gerechtigkeit", "article": "die", "explanation": "Alle Menschen werden fair behandelt. Niemand hat ohne Grund mehr oder weniger.", "example": "Amir arbeitet seit zehn Jahren. Er fragt: Ist das fair?" },
  { "id": 2, "word": "Gleichheit", "article": "die", "explanation": "Alle Menschen sind gleich wichtig. Alle bekommen das Gleiche.", "example": "Reiche und arme Kinder lernen mit der gleichen KI." },
  { "id": 3, "word": "Solidarität", "article": "die", "explanation": "Menschen helfen einander. Die Starken helfen den Schwachen.", "example": "Amirs Kollegen verlieren die Arbeit. Wer hilft ihnen?" },
  { "id": 4, "word": "Hilfe", "article": "die", "explanation": "Jemand ist in einer schweren Situation. Andere tun etwas für ihn.", "example": "Ohne Arbeit braucht Amir Hilfe, zum Beispiel Geld." },
  { "id": 5, "word": "Arbeit", "article": "die", "explanation": "Man arbeitet und bekommt Geld. Für viele Menschen ist Arbeit auch mehr: Sie ist ein Teil vom Leben.", "example": "Amir sagt: Meine Arbeit ist wichtig für mich." },
  { "id": 6, "word": "Entscheidung", "article": "die", "explanation": "Ich wähle selbst: ja oder nein, so oder so. Niemand wählt für mich.", "example": "Lina sagt: Wann ich KI benutze — das ist meine Entscheidung." },
  { "id": 7, "word": "Selbstbestimmung", "article": "die", "explanation": "Ich bestimme über mein Leben. Nicht der Staat, nicht andere Menschen.", "example": "Lina entscheidet selbst, wie sie lernt." },
  { "id": 8, "word": "Fortschritt", "article": "der", "explanation": "Etwas wird neu und besser. Die Welt geht nach vorne.", "example": "Vor 100 Jahren: kein Internet. Heute: KI. Das ist Fortschritt — sagen viele." },
  { "id": 9, "word": "Chance", "article": "die", "explanation": "Eine gute Möglichkeit. Man kann etwas Neues erreichen.", "example": "Mit KI kann Lina schneller lernen. Für sie ist das eine Chance." },
  { "id": 10, "word": "Offenheit", "article": "die", "explanation": "Man sagt Ja zu Neuem und zu anderen Menschen und Ideen.", "example": "Linas Eltern sprechen kein Deutsch. KI öffnet für sie eine Tür." },
  { "id": 11, "word": "Familie", "article": "die", "explanation": "Eltern, Kinder, Großeltern. Für viele Menschen der wichtigste Ort im Leben.", "example": "Thomas sagt: Ich will meine Familie schützen." },
  { "id": 12, "word": "Tradition", "article": "die", "explanation": "Dinge, die wir seit langer Zeit so machen. Sie kommen von unseren Eltern und Großeltern.", "example": "Feste, Sprache, Essen — das ist Tradition." },
  { "id": 13, "word": "Heimat", "article": "die", "explanation": "Der Ort, wo man sich zu Hause fühlt. Die Sprache und die Menschen dort.", "example": "Weit weg von zu Hause denkt man oft an die Heimat." },
  { "id": 14, "word": "Ordnung", "article": "die", "explanation": "Es gibt klare Regeln. Jeder weiß, was richtig ist. Nichts ist Chaos.", "example": "Ohne Regeln im Straßenverkehr: Unfälle. Regeln machen Ordnung." },
  { "id": 15, "word": "Gemeinschaft", "article": "die", "explanation": "Eine Gruppe von Menschen. Sie gehören zusammen und sagen: wir.", "example": "Eine Klasse, ein Dorf, ein Land — das sind Gemeinschaften." },
  { "id": 16, "word": "Freiheit", "article": "die", "explanation": "Ich kann tun, was ich will. Niemand kontrolliert mich ohne Grund.", "example": "Lina will frei entscheiden. Thomas will frei von Kontrolle leben. Ist das die gleiche Freiheit?" },
  { "id": 17, "word": "Schutz", "article": "der", "explanation": "Jemand passt auf, dass nichts Schlimmes passiert.", "example": "Amir braucht Schutz für seine Arbeit. Thomas will Schutz für seine Kinder." },
  { "id": 18, "word": "Sicherheit", "article": "die", "explanation": "Man hat keine Angst. Man weiß: Morgen ist alles okay.", "example": "Amir sagt: Ich brauche Sicherheit." },
  { "id": 19, "word": "Vertrauen", "article": "das", "explanation": "Ich glaube: Dieser Mensch (oder diese Sache) ist gut zu mir. Ich habe keine Angst vor ihm.", "example": "Kann man einer KI vertrauen? Kann man dem Staat vertrauen?" },
  { "id": 20, "word": "Verantwortung", "article": "die", "explanation": "Ich muss auf etwas aufpassen. Wenn etwas schlecht läuft, ist es mein Problem.", "example": "Die KI macht einen Fehler. Wer hat die Verantwortung?" }
];

const gallery = document.querySelector("[data-gallery]");
const mixButton = document.querySelector("[data-mix]");
const hint = document.querySelector("[data-hint]");
const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

let hasFlipped = false;
let resizeTimer;

function shuffle(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function speak(entry) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`${entry.article} ${entry.word}. ${entry.explanation}`);
  utterance.lang = "de-DE";
  window.speechSynthesis.speak(utterance);
}

function flip(card) {
  card.classList.toggle("is-flipped");
  card.setAttribute("aria-pressed", card.classList.contains("is-flipped") ? "true" : "false");

  if (!hasFlipped) {
    hasFlipped = true;
    hint.classList.add("is-hidden");
  }
}

function buildCard(entry) {
  const card = makeElement("div", "card");
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-pressed", "false");
  card.setAttribute("aria-label", `${entry.article} ${entry.word}`);

  const inner = makeElement("span", "card-inner");
  const front = makeElement("span", "card-face card-front");
  const article = makeElement("span", "article", entry.article);
  const word = makeElement("span", "word", entry.word);
  const affordance = makeElement("span", "affordance", "↻");
  affordance.setAttribute("aria-hidden", "true");

  const back = makeElement("span", "card-face card-back");
  const explanation = makeElement("span", "explanation", entry.explanation);
  const example = makeElement("span", "example", entry.example);

  front.append(article, word, affordance);
  back.append(explanation, example);

  if (canSpeak) {
    const readButton = makeElement("button", "read-button", "Vorlesen");
    readButton.type = "button";
    readButton.addEventListener("click", (event) => {
      event.stopPropagation();
      speak(entry);
    });
    back.append(readButton);
  }

  inner.append(front, back);
  card.append(inner);
  card.addEventListener("click", () => flip(card));
  card.addEventListener("keydown", (event) => {
    if (event.target !== card) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip(card);
    }
  });

  return card;
}

function fitWords() {
  const wordElements = gallery.querySelectorAll(".word");

  wordElements.forEach((wordElement) => {
    wordElement.classList.remove("can-break");
    wordElement.style.fontSize = "";

    let size = parseFloat(window.getComputedStyle(wordElement).fontSize);
    const minSize = 18;

    while (wordElement.scrollWidth > wordElement.clientWidth && size > minSize) {
      size -= 1;
      wordElement.style.fontSize = `${size}px`;
    }

    if (wordElement.scrollWidth > wordElement.clientWidth) {
      wordElement.classList.add("can-break");
    }
  });
}

function render() {
  gallery.replaceChildren(...shuffle(WORDS).map(buildCard));
  window.requestAnimationFrame(fitWords);
}

mixButton.addEventListener("click", render);
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(fitWords, 100);
});
render();
