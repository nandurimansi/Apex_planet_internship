const quizData = [
  {
    question: "Which planet is known as the Blue Planet?",
    options: ["Mars", "Venus", "Earth", "Neptune"],
    answer: "Earth"
  },
  {
    question: "How much of the Earth's surface is covered by water?",
    options: ["30%", "50%", "70%", "90%"],
    answer: "70%"
  },
  {
    question: "What is the only planet known to support life?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Earth"
  },
  {
    question: "What layer protects Earth from the Sun's radiation?",
    options: ["Troposphere", "Stratosphere", "Ozone Layer", "Exosphere"],
    answer: "Ozone Layer"
  }
];

let currentQuestion = 0;
let score = 0;

const questionBox = document.getElementById("question-box");
const optionsBox = document.getElementById("options-box");
const nextBtn = document.getElementById("next-btn");
const scoreText = document.getElementById("score");

// Initialize
nextBtn.disabled = true;
nextBtn.style.display = "block"; // keep centered

function showQuestion() {
  // Reset UI
  const q = quizData[currentQuestion];
  questionBox.innerHTML = `<h3>${q.question}</h3>`;
  optionsBox.innerHTML = "";
  nextBtn.disabled = true;            // disable Next until user answers
  nextBtn.textContent = (currentQuestion < quizData.length - 1) ? "Next" : "Finish";

  // Create option buttons
  q.options.forEach(opt => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = opt;
    button.type = "button";
    // store the option text on the element for easy lookup
    button.dataset.option = opt;
    button.addEventListener("click", () => selectAnswer(button, opt));
    optionsBox.appendChild(button);
  });
}

function selectAnswer(button, selected) {
  // If already answered (buttons disabled) do nothing
  if (optionsBox.querySelector("button:disabled")) return;

  const correct = quizData[currentQuestion].answer;

  // Disable all option buttons immediately to lock the answer
  const allButtons = Array.from(optionsBox.querySelectorAll("button"));
  allButtons.forEach(btn => btn.disabled = true);

  // Mark chosen button and correct answer visually
  if (selected === correct) {
    score++;
    button.classList.add("correct");
  } else {
    button.classList.add("wrong");
    // highlight the correct button
    const correctBtn = allButtons.find(b => b.dataset.option === correct);
    if (correctBtn) correctBtn.classList.add("correct");
  }

  // Enable Next so user can proceed
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  // clear score display between questions
  scoreText.textContent = "";
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  questionBox.innerHTML = "<h3>Quiz Completed!</h3>";
  optionsBox.innerHTML = "";
  scoreText.textContent = `Your Score: ${score} / ${quizData.length}`;
  nextBtn.style.display = "none";
}
// Start quiz
currentQuestion = 0;
score = 0;
showQuestion();
