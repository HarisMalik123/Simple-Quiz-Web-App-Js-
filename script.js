function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

class Question {
    constructor(id, question, answer, incorrectAnswers) {
        this.id = id;
        this.question = decodeHTMLEntities(question);
        this.answer = answer;
        const options = [...incorrectAnswers, answer];
        this.options = shuffle(options);
        this.isanswered = false;
    }

    display() {
        const questionNumElem = document.querySelector('.questionnum');
        questionNumElem.innerHTML = ''; // Clear previous heading

        const heading = document.createElement('h1');
        heading.textContent = `Question ${this.id}`;
        heading.style.textAlign = 'center';
        heading.style.fontSize = '24px';
        heading.style.padding = '20px';
        questionNumElem.append(heading);

        const questionElem = document.querySelector('.question');
        questionElem.innerHTML = ''; // Clear previous question

        const text = document.createElement('p');
        text.setAttribute('id', 'questiontext');
        text.style.padding = '20px';
        text.style.fontSize = '24px';
        text.textContent = this.question;
        questionElem.append(text);

        const optionElem = document.querySelector('.options');
        optionElem.innerHTML = ''; // Clear previous options

        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';

        this.options.forEach(option => {
            const li = document.createElement('li');
            const optionButton = document.createElement('button');
            optionButton.className = 'animatedButton';
            optionButton.id='optionbutton'
            optionButton.textContent = option;
            optionButton.onclick = () => validate(optionButton);

            li.appendChild(optionButton);
            ul.appendChild(li);
        });

        optionElem.appendChild(ul);
    }
}

let index = 0;
let point = 0;
let ansquestion=0;

function showresult()
{
    
    alert(`Your Score is ${point}`)
    
}
function nextquestion() {
    index++;
    if (index > 19 && ansquestion==20) {
        showresult();
        return;
    }
    else if(index > 19){
alert('Go Back answer every question')
    }
    while (questions[index].isanswered) {
        index++;
        if (index > 19) {
            showresult();
            return;
        }
    }
    questions[index].display();
}

function previousquestion() {
    index--;
    if (index < 0) {
        alert('Cannot go back; this is the first question.');
        return;
    }
    while (questions[index].isanswered) {
        index--;
        if (index < 0) {
            alert('Cannot go back; this is the first question.');
            return;
        }
    }
    questions[index].display();
}

function validate(button) {
    const buttontext = button.textContent || button.innerText;
    if (buttontext === questions[index].answer) {
        button.style.backgroundColor = 'Green';
        point++;
    } else {
        button.style.backgroundColor = 'Red';
    }
    questions[index].isanswered = true;
    

    const buttons = document.querySelectorAll('#optionbutton');
    buttons.forEach(btn => btn.disabled = true);

 
}


fetch('https://opentdb.com/api.php?amount=20&category=21&difficulty=easy&type=multiple')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response is not OK');
        }
        return response.json();
    })
    .then(data => {
        const result = data.results;
        questions = result.map((item, index) => {
            return new Question(index + 1, item.question, item.correct_answer, item.incorrect_answers);
        });

       
        questions[index].display();
    })
    .catch(error => {
        console.error("There was a problem in fetching", error);
    });
