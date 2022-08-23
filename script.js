var subjectIpt = document.getElementById("subject");
var questionIpt = document.getElementById("question");
var searchBar = document.getElementById("search");
var submitQuestion = document.getElementById("submitQuestion");
var questionContainer = document.getElementById("questionContainer");
var createQuestionContainer = document.getElementsByClassName("createQuestionContainer")[0];
var newQuestionBtn = document.getElementById("newQuestionBtn");

window.onload= function(){
  searchBar.value = "";
  subjectIpt.value = "";
  questionIpt.value = "";
}


newQuestionBtn.addEventListener("click", function(){
  location.reload()
})

submitQuestion.addEventListener("click", function(){
  var subValue = subjectIpt.value;
  var qtValue = questionIpt.value;
  
  addQuestion(subValue, qtValue);
  
})


function checkValidInput(input1, input2){
  if(input1.trim().length == 0 || input2.trim().length == 0){
    console.log("One or both fields are empty");
    alert("One or both fields are empty");
    return false;
  }
  return true;
}


function addQuestion(subValue, qtValue){
  if(!checkValidInput(subValue, qtValue))
    return;

  addQuestionToLocalStorage(subValue, qtValue);
  getQuestionsFromLocalStorage();
  clearIpt(subjectIpt, questionIpt);
}


function printQuestion(subValue, qtValue){
  var questionBox = document.createElement('div');
  questionBox.style.display = "inline-block";
  questionBox.style.width = "70%";

  var subject = document.createElement("p");
  subject.innerText = subValue;
  subject.style.marginTop = 0;
  subject.style.marginBottom = "0.5%";
  subject.style.fontSize = 'x-large';
  subject.style.wordBreak = "break-word"

  var question = document.createElement("p");
  question.innerText = qtValue;
  question.style.marginTop = 0;
  question.style.fontSize = 'large';
  question.style.wordBreak = "break-word"


  questionBox.appendChild(subject);
  questionBox.appendChild(question);

  questionBox.addEventListener("click", function(){
    clearNode(createQuestionContainer);
    //subValue, qtValue
    var questions = JSON.parse(localStorage.getItem("questions"));
    var question = questions.find(question=>question.title == subValue
    )

    printQuestionDetails(question);
  })

  questionContainer.appendChild(questionBox);

  var voteDiv = document.createElement('div');
  voteDiv.style.display = "inline-block";
  voteDiv.style.width = "10%";
  displayVotes(qtValue, voteDiv);
  questionContainer.appendChild(voteDiv)

  var upVoteBtnContainer= document.createElement("div");
  upVoteBtnContainer.style.display = "inline-block";
  upVoteBtnContainer.style.width = "10%"
  var upVoteBtn = document.createElement('img');
  upVoteBtn.src = "./images/thumbs-up.png";
  upVoteBtn.width = 18;
  upVoteBtnContainer.appendChild(upVoteBtn);
  questionContainer.appendChild(upVoteBtnContainer);
  
  upVoteBtn.addEventListener('click', function(){
    var questions = JSON.parse(localStorage.getItem("questions"));
    questions.forEach(question => {
      if(question.description == qtValue){
        question.upVotes++;
        localStorage.setItem("questions", JSON.stringify(questions));
        displayVotes(qtValue, voteDiv);
        getQuestionsFromLocalStorage();
        return;
      }
    });
  })

  var downVoteBtnContainer= document.createElement("div");
  downVoteBtnContainer.style.display = "inline-block";
  downVoteBtnContainer.style.width = "10%"
  var downVoteBtn = document.createElement('img');
  downVoteBtn.src = "./images/thumb-down.png";
  downVoteBtn.width = 18;
  downVoteBtnContainer.appendChild(downVoteBtn);
  questionContainer.appendChild(downVoteBtnContainer);

  downVoteBtn.addEventListener('click', function(){
    var questions = JSON.parse(localStorage.getItem("questions"));
    questions.forEach(question => {
      if(question.description == qtValue){
        question.upVotes--;
        localStorage.setItem("questions", JSON.stringify(questions));
        displayVotes(qtValue, voteDiv);
        getQuestionsFromLocalStorage();

        return;
      }
    });
  })

}

function displayVotes(qtValue, voteDiv){
  clearNode(voteDiv)
  var questions = JSON.parse(localStorage.getItem("questions"));
  var votes = 0;
  questions.forEach(question=>{
    if(question.description == qtValue){
      votes = question.upVotes;
      return;
    }
  })
  var upVotePara = document.createElement('p');
  upVotePara.innerText = votes;
  upVotePara.style.width = "100%"
  voteDiv.appendChild(upVotePara);
}

function printQuestionDetails(clickedQuestion){

  var heading1 = document.createElement('h2');
  heading1.innerText = "Question";
  createQuestionContainer.appendChild(heading1); 

  var questionBox = document.createElement('div');
  var title = document.createElement("p");
  title.innerText = clickedQuestion.title;
  title.style.marginTop = 0;
  title.style.marginBottom = "0.5%";
  title.style.fontSize = 'x-large';
  title.style.wordBreak = "break-word"

  var description = document.createElement("p");
  description.innerText = clickedQuestion.description;
  description.style.marginTop = 0;
  description.style.fontSize = 'large';
  description.style.wordBreak = "break-word"

  questionBox.appendChild(title);
  questionBox.appendChild(description);
  questionBox.style.backgroundColor = "lightgrey";

  var resolveBtn = document.createElement('button');
  resolveBtn.setAttribute('class', 'button');
  resolveBtn.innerHTML = 'Resolve';
  resolveBtn.style.float = 'right';
  questionBox.appendChild(resolveBtn);

  createQuestionContainer.appendChild(questionBox);
  createQuestionContainer.appendChild(document.createElement('br'));

  resolveBtn.addEventListener('click', function(){
    var questions = JSON.parse(localStorage.getItem("questions"));
    questions.forEach((question)=> {
      if(clickedQuestion.description == question.description){
        questions.splice(question, 1);
        localStorage.setItem("questions", JSON.stringify(questions));
        location.reload()
        return;
      }   
  })
  })

  var heading2 = document.createElement('h2');
  heading2.innerText = "Responses";
  createQuestionContainer.appendChild(heading2);

  var responseBox = document.createElement('div');
  if(clickedQuestion.responses.length){
    clickedQuestion.responses.forEach(response=>{
      getResponsesFromLocalStorage(clickedQuestion, responseBox);
    })
  }else{
    var noResponse = document.createElement('p');
    noResponse.style.fontSize = 'large';
    noResponse.innerText = "No responses yet"
    responseBox.appendChild(noResponse);
  }
  createQuestionContainer.appendChild(responseBox);

  var heading3 = document.createElement('h2');
  heading3.innerText = "Add Response";
  createQuestionContainer.appendChild(heading3);
  addResponseForm(createQuestionContainer, clickedQuestion, responseBox);

}

function addResponseForm(element, question, responseBoxtoAppend){
  var formBox = document.createElement('div');
  var name = document.createElement('input');
  name.setAttribute("class", "input");
  name.setAttribute("placeholder", "Enter name");
  formBox.appendChild(name);

  var br = document.createElement('br');
  formBox.appendChild(br);

  var answer = document.createElement("textarea");
  answer.setAttribute("placeholder", "Enter Comment")
  answer.setAttribute("class", "input");
  answer.setAttribute("rows", 10);
  answer.style.width = '100%'
  answer.setAttribute("response", "Enter response");
  formBox.appendChild(answer);

  var submitResponseBtn = document.createElement('button');
  submitResponseBtn.setAttribute('class', 'button');
  submitResponseBtn.innerHTML = 'Submit';
  submitResponseBtn.style.float = 'right';
  formBox.appendChild(submitResponseBtn);

  submitResponseBtn.addEventListener('click', function(){

    var nameValue = name.value;
    var answerValue = answer.value;

    if(!checkValidInput(name.value, answerValue))
      return;

    var response = {name : nameValue ,answer : answerValue, upVotes : 0};
    var questions = JSON.parse(localStorage.getItem("questions"));
    questions.forEach((qt)=> {
        if(qt.description == question.description){
          qt.responses.push(response);
          localStorage.setItem("questions", JSON.stringify(questions));
          if(responseBoxtoAppend.firstChild.innerHTML == "No responses yet")
            clearNode(responseBoxtoAppend);
          printResponse(question, response, responseBoxtoAppend);
          return;
        }   
    })
    clearIpt(name, answer);
  })

  element.appendChild(formBox);
  
}

function printResponse(question, response, box){

  var responseDiv = document.createElement('div');
  responseDiv.style.display = "inline-block";
  responseDiv.style.width = "70%";
  
  var name = document.createElement("p");
  name.innerText = response.name;
  name.style.marginTop = 0;
  name.style.marginBottom = "0.5%";
  name.style.fontSize = 'x-large';

  var answer = document.createElement("p");
  answer.innerText = response.answer;
  answer.style.marginTop = 0;
  answer.style.fontSize = 'large';
  responseDiv.appendChild(name);
  responseDiv.appendChild(answer);
  box.appendChild(responseDiv);
  box.style.backgroundColor = "lightgrey";

  var upVoteBtnContainer = document.createElement('div');
  var upVoteBtn = document.createElement("img");
  upVoteBtn.src = "./images/thumbs-up.png";
  upVoteBtn.width = 14;
  upVoteBtnContainer.style.display = 'inline-block';
  upVoteBtnContainer.style.width = "7.5%";
  upVoteBtnContainer.appendChild(upVoteBtn);
  box.appendChild(upVoteBtnContainer);

  upVoteBtn.addEventListener('click', function(){
    var questions = JSON.parse(localStorage.getItem("questions"));
    var done = false;

    questions.forEach(qt => {
      if(qt.description == question.description){
        qt.responses.forEach(res=>{
          
          if(response.answer == res.answer){
            res.upVotes++;
            localStorage.setItem('questions', JSON.stringify(questions));
            getResponsesFromLocalStorage(qt, box)
            displayVotesForResponse(upVotesContainer, question, response);
            done = true;
            return;
          }
        })
      }
      if(done)
        return;
    });
  })

  var downVoteBtnContainer = document.createElement('div');
  var downVoteBtn = document.createElement("img");
  downVoteBtn.src = "./images/thumb-down.png";
  downVoteBtn.width = 14;
  downVoteBtnContainer.style.display = 'inline-block';
  downVoteBtnContainer.style.width = "7.5%";
  downVoteBtnContainer.appendChild(downVoteBtn)
  box.appendChild(downVoteBtnContainer)


  downVoteBtn.addEventListener('click', function(){
    var questions = JSON.parse(localStorage.getItem("questions"));
    var done = false;

    questions.forEach(qt => {
      if(qt.description == question.description){
        qt.responses.forEach(res=>{
          if(response.answer == res.answer){
            res.upVotes--;
            localStorage.setItem('questions', JSON.stringify(questions));
            getResponsesFromLocalStorage(qt, box)
            displayVotesForResponse(upVotesContainer, question, response);
            done = true;
            return;
          }
        })
      }
      if(done)
        return;
    });
  })

  var upVotesContainer = document.createElement('div');
  upVotesContainer.style.display = 'inline-block';
  upVotesContainer.style.width = "5%";
  displayVotesForResponse(upVotesContainer, question, response);
  box.appendChild(upVotesContainer);
  

function displayVotesForResponse(upVotesContainer, question, response){
  clearNode(upVotesContainer)

  var questions = JSON.parse(localStorage.getItem("questions"));
  var done = false;
  var votesValue = 0;

  questions.forEach(qt => {
    if(qt.description == question.description){
      qt.responses.forEach(res=>{
        if(response.answer == res.answer){
          votesValue = res.upVotes;
          done = true;
          return;
        }
      })
    }
    if(done)
      return;
  });

  var upVotePara = document.createElement('p');
  upVotePara.innerText = votesValue;
  upVotePara.style.fontSize = "small"
  upVotesContainer.appendChild(upVotePara);

}

}

function fetchDetailsFromLocalStorage(){
  var questions = JSON.parse(localStorage.getItem("questions"));
  if(!questions)
    return;
  questions.forEach(question => {
      
      printQuestion(question.title, question.description);
  });
}


function addQuestionToLocalStorage(subValue, qtValue){

  var questions = JSON.parse(localStorage.getItem("questions"));
  var question = {
    title : subValue,
    description : qtValue,
    responses : [], 
    isResolved : false,
    upVotes : 0,
    createdAt : new Date(),
    }
  
  if(!questions){
    questions = [];
    questions.push(question);
    localStorage.setItem("questions", JSON.stringify(questions));
  }else{
    questions.push(question);
    localStorage.setItem("questions", JSON.stringify(questions));
  }
  
}

function clearIpt(input1, input2){
  input1.value = "";
  input2.value = "";
}

function getQuestionsFromLocalStorage(){
  clearNode(questionContainer)
  var questions = JSON.parse(localStorage.getItem("questions"));
  if(!questions)
    return;

  questions.sort(function(a, b){
    return b.upVotes - a.upVotes;
  })
  questions.forEach(question => {
      printQuestion(question.title, question.description);
  });
}

function getResponsesFromLocalStorage(question, box){
  clearNode(box)
  if(!question.responses)
    return;
  question.responses.sort(function(a, b){
    return b.upVotes - a.upVotes;
  })
  question.responses.forEach(res => {
    printResponse(question, res, box)
});
}

getQuestionsFromLocalStorage();


searchBar.addEventListener("input", function(){

  clearNode(questionContainer);

  var questions = JSON.parse(localStorage.getItem("questions"));
  if(!questions)
    return;
  var found = false;
  questions.forEach(question => {
    if(question.title.toLowerCase().includes(searchBar.value.toLowerCase()) || question.description.toLowerCase().includes(searchBar.value.toLowerCase())){
      printQuestion(question.title, question.description);
      found = true;
      return;
    }
  });
  if(found)
    return;

  var notFound = document.createElement('p');
  notFound.style.fontSize = "25px"
  notFound.innerText = "No matches found";
  questionContainer.appendChild(notFound)
})


function clearNode(container){
  while(container.lastElementChild){
    container.removeChild(container.lastElementChild);
  }
}

