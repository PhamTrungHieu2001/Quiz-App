const quiz = document.getElementById('quiz');
const submit = document.getElementById('submit');
const results = document.getElementById('results');
let myQuestions = [] 

function showQuiz(){
  const quizArr = [];

  myQuestions.forEach((item, index) => {
    const answers = [];

    for(answer in item.answers){
      if (!item.multi) {
        answers.push(
          `<label>
            <input type="radio" name="question${index}" value="${answer}">
            ${answer} : ${item.answers[answer]}
          </label>`
        );
      } else {
        answers.push(
          `<label>
            <input type="checkbox" name="question${index}" value="${answer}">
            ${answer} : ${item.answers[answer]}
          </label>`
        );
      }
    }

    quizArr.push(
      `<div class="quiz__item">
        <div class=question>${index + 1}. ${item.question} </div>
        <div class=answers> ${answers.join('')} </div>
      </div>`
    );
  });

  quiz.innerHTML = quizArr.join('');
}

function showQuizItem(item) {
  quizItem[currentQuiz].classList.remove('active');
  quizItem[item].classList.add('active');
  currentQuiz = item;

  (currentQuiz === 0) ? previous.setAttribute('disabled', true) :  previous.removeAttribute('disabled');

  if(currentQuiz === quizItem.length-1){
    next.setAttribute('disabled', true);
    submit.style.display = 'block';
  }
  else{
    next.removeAttribute('disabled');
    submit.style.display = 'none';
  }
}

function showResults(){
  const answers = quiz.querySelectorAll('.answers');
  let correctAnswer = 0;

  myQuestions.forEach((item, index) => {
    const answer = answers[index];
    const selector = `input[name=question${index}]:checked`;

    if (!item.multi) {
      const userAnswer = (answer.querySelector(selector) || {}).value;
      if(userAnswer === item.correctAnswer){
        correctAnswer++;
        answers[index].style.color = 'green';
      }
      else{
        answers[index].style.color = 'red';
      }
    } else {
      const userAnswer = []
      const listAnswer = (answer.querySelectorAll(selector) || {});

      listAnswer.forEach(item => {
        userAnswer.push(item.value);   
      })
      
      if (userAnswer.length !== item.correctAnswer.length) {
        answers[index].style.color = 'red';
      } else {
        for (let i = 0; i < userAnswer.length; i++) {
          if (userAnswer[i] !== item.correctAnswer[i]) {
            return
          }
          answers[index].style.color = 'red';
        }
        correctAnswer++;
        answers[index].style.color = 'green';
      }
    }
  });

  results.innerHTML = `${correctAnswer} out of ${myQuestions.length}`;
}

let quizItem = null;
let previous = null;
let next = null;
let currentQuiz = 0;

(async function() {
  const res = await fetch('./default-data.json') 
  const data = await res.json()
    myQuestions = data

    showQuiz();
    
    quizItem = document.querySelectorAll(".quiz__item");
    previous = document.getElementById("previous");
    next = document.getElementById("next");

    showQuizItem(currentQuiz);

    previous.addEventListener("click", () => {
      showQuizItem(currentQuiz - 1);
    });
    
    next.addEventListener("click", () => {
      showQuizItem(currentQuiz + 1);
    });
})()

submit.addEventListener('click', showResults);
