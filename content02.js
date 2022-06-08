'use strict'

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', ()=> {
    if (started) {
        stopGame();
    } else {
        startGame();
    }
    started = !started;
    //started가 true였다면, 버튼 클릭 시 false로 변경되고
    //started가 false였다면, 버튼 클릭 시 true로 변경된다
});

popUpRefresh.addEventListener('click', ()=>{
    startGame();
    hidePopUp();
});

function startGame() {
    initGame();
    showStopButton();
    showTimerandScore();
    startGameTimer();
    playSound(bgSound);
}

function showTimerandScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function stopGame() {
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY?');
    playSound(alertSound);
    stopSound(bgSound);
}

function finishGame(win) {
    started = false;
    hideGameButton();
    if (win) {
        playSound(winSound);
      } else {
        playSound(bugSound);
      }
    stopSound(bgSound);
    showPopUpWithText(win ? 'YOU WIN!' : 'YOU LOST..');
}

function showStopButton() {
    //PlayBtn클릭 시 아이콘 변경
    const icon = gameBtn.querySelector('.fas');
    console.log(icon);
    //icon.classList.add('fa-stop');
    //icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}

function hideGameButton() {
    gameBtn.style.visibility = 'hidden';
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if (remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    },1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time){
    const minutes = Math.floor(time / 60);
    //floor: 소수 -> 정수 변환
    const second = time % 60;
    gameTimer.innerText = `${minutes}:${second}`;
}

function showPopUpWithText(text) {
    popUpText.innerText = text;
    popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
    popUp.classList.add('pop-up--hide');
}

function initGame(){
    score=0;
    field.innerHTML = '';
    //버튼 클릭 시 마다 아이템이 중복해서 쌓이지 않도록 설정
    gameScore.innerText = CARROT_COUNT;
    //innerHTML: element안의 모든 HTML요소를 가져옴
    //innerText: element안의 text값들만을 가져옴
    addItem('carrot', CARROT_COUNT, './img/carrot.png');
    addItem('bug', BUG_COUNT, './img/bug.png');
}

function onFieldClick(event){
    if (!startGame){
        return;
    }
    const target = event.target;
    if (target.matches('.carrot')) {
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if (score === CARROT_COUNT) {
            stopGameTimer();
            finishGame(true);
        }
    } else if (target.matches('.bug')) {
        stopGameTimer();
        finishGame(false);
    }
    //matches: css selector와 일치하는지 확인
}

function playSound(sound) {
    sound.play();
}

function stopSound(sound) {
    sound.currentTime = 0;
    //음악은 항상 처음부터 시작하도록 설정
    sound.pause();
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    //이미지 좌측상단이 position에 맞춰지기 때문에 field태두리 부분에 position이 잡힐 경우, 이미지가 field를 넘어갈 수 있음. 따라서 max에는 CARROT의 SIZE를 제외해줌
    for (let i=0; i<count; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        //field안에서 좌측상단 0.0을 기준으로 배치될 수 있도록 설정
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`
        item.style.top = `${y}px`
        field.appendChild(item);
    }
}
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}