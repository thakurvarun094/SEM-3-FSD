
function doLogin() {
	var uname = document.getElementById("name").value;
	var pass = document.getElementById("roll").value;
	
	if (uname == "" || pass == "") {
		document.getElementById("loginMsg").innerHTML = "Please fill both fields!";
		document.getElementById("loginMsg").style.color = "red";
	} else {
		document.getElementById("loginMsg").innerHTML = "Login success! redirecting...";
		document.getElementById("loginMsg").style.color = "green";
		setTimeout(function() {
			location.href = "quiz.html";
		}, 800);
	}
}

document.addEventListener("keydown", function(e) {
	if (document.getElementById("loginBtn") && e.key == "Enter") {
		doLogin();
	}
});



var questions = [
	{
		q: "Which tag is used to link a CSS file in HTML?",
		options: ["css", "link", "style", "script"],
		answer: 1
	},
	{
		q: "Which keyword is used to declare a variable in modern JavaScript?",
		options: ["var only", "let", "int", "dim"],
		answer: 1
	},
	{
		q: "What does DOM stand for?",
		options: ["Document Object Model", "Data Object Model", "Display Object Mode", "Document Order Model"],
		answer: 0
	},
	{
		q: "Which event fires when a mouse button is clicked?",
		options: ["onkeydown", "onclick", "onhover", "onchange"],
		answer: 1
	},
	{
		q: "Which HTML tag creates a table row?",
		options: ["td", "th", "tr", "table"],
		answer: 2
	}
];

var currentQ = 0;
var score = 0;
var selectedOption = null;
var answered = false;
var timeLeft = 300; 
var timerInterval = null;

function startQuiz() {
	if (!document.getElementById("quizBox")) {
		return; 
	}
	loadQuestion();
	timerInterval = setInterval(updateTimer, 1000);

	
	document.addEventListener("keydown", function(e) {
		if (e.key == "1") selectOption(0);
		if (e.key == "2") selectOption(1);
		if (e.key == "3") selectOption(2);
		if (e.key == "4") selectOption(3);
		if (e.key == "Enter") nextQuestion();
	});
}

function loadQuestion() {
	answered = false;
	selectedOption = null;

	var qObj = questions[currentQ];
	document.getElementById("questionNo").innerHTML = "Question " + (currentQ + 1) + " of " + questions.length;
	document.getElementById("questionText").innerHTML = qObj.q;

	for (var i = 0; i < 4; i++) {
		document.getElementById("opt" + i).innerHTML = qObj.options[i];
	}

	var opts = document.getElementsByClassName("option");
	for (var i = 0; i < opts.length; i++) {
		opts[i].className = "option";
	}
}

function selectOption(index) {
	if (answered) return; 

	selectedOption = index;

	var opts = document.getElementsByClassName("option");
	for (var i = 0; i < opts.length; i++) {
		opts[i].className = "option";
	}
	opts[index].className = "option selected";
}

function nextQuestion() {
	if (!document.getElementById("quizBox")) return;

	if (!answered) {
	
		if (selectedOption == null) {
			alert("Please select an option first!");
			return;
		}

		var opts = document.getElementsByClassName("option");
		var correctIndex = questions[currentQ].answer;

		if (selectedOption == correctIndex) {
			opts[selectedOption].className = "option correct";
			score++;
		} else {
			opts[selectedOption].className = "option wrong";
			opts[correctIndex].className = "option correct";
		}

		answered = true;
		document.getElementById("nextBtn").innerHTML = "Next Question";
	} else {
		currentQ++;
		if (currentQ < questions.length) {
			loadQuestion();
			document.getElementById("nextBtn").innerHTML = "Next";
		} else {
			endQuiz();
		}
	}
}

function updateTimer() {
	timeLeft--;

	var min = Math.floor(timeLeft / 60);
	var sec = timeLeft % 60;
	if (sec < 10) sec = "0" + sec;
	if (min < 10) min = "0" + min;

	document.getElementById("timer").innerHTML = min + ":" + sec;

	if (timeLeft <= 0) {
		endQuiz();
	}
}

function endQuiz() {
	clearInterval(timerInterval);
	document.getElementById("quizBox").style.display = "none";
	document.getElementById("resultBox").style.display = "block";
	document.getElementById("finalScore").innerHTML = "Your Score : " + score + " / " + questions.length;
}
