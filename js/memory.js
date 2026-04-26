const resources = ['../resources/cb.svg', '../resources/co.svg',
                '../resources/sb.svg', '../resources/so.svg',
                '../resources/tb.svg', '../resources/to.svg'];
const back = '../resources/back.svg';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    lastCard: null,
    score: 200,

    totalCards: 2,
    pairs: 2,

    // MODE 2
    mode: "mode1",
    level: 1,
    timeLimit: 60,
    timeLeft: null,
    timer: null,
    groupSize: 2,
    penalty: 25,

    applyDifficulty: function(level) {
        this.totalCards = Math.min(2 + level, 6);
        this.groupSize = 2 + Math.floor(level / 2);
        this.timeLimit = Math.max(20, 60 - level * 5);
        this.penalty = 25 + (level * 5);
    },

    select: function(){

        let savedOptions = localStorage.options && JSON.parse(localStorage.options);

        let mode = "mode1";
        if (savedOptions && savedOptions.mode) mode = savedOptions.mode;
        this.mode = mode;

        if (this.mode === "mode2") this.level = 1;

        let groupSize = 2;
        if (savedOptions && savedOptions.groupSize && this.mode === "mode1")
            groupSize = parseInt(savedOptions.groupSize);

        if (savedOptions && savedOptions.pairs && this.mode === "mode1")
            this.totalCards = parseInt(savedOptions.pairs);

        if (this.mode === "mode2") {
            this.applyDifficulty(this.level);
            groupSize = this.groupSize;
        }

        if (sessionStorage.load){
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.lastCard = toLoad.lastCard;
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
            this.mode = toLoad.mode;
            this.level = toLoad.level;
            this.timeLeft = toLoad.timeLeft;
            this.totalCards = toLoad.totalCards;
            this.groupSize = toLoad.groupSize;
            this.penalty = toLoad.penalty;
        }
        else{
            this.items = resources.slice();
            shuffe(this.items);
            this.items = this.items.slice(0, this.totalCards);

            let original = this.items.slice();
            for (let i = 1; i < groupSize; i++)
                this.items = this.items.concat(original);

            shuffe(this.items);

            this.states = new Array(this.items.length);
            this.pairs = this.items.length / 2;
        }
    },

    start: function(){

        if (this.mode === "mode2") {
            this.timeLeft = this.timeLimit;

            this.timer = setInterval(() => {
                this.timeLeft--;
                if (this.timeLeft <= 0) {
                    clearInterval(this.timer);
                    alert("Temps esgotat!");
                    window.location.assign("../");
                }
            }, 1000);
        }

        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },

    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },

    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },

    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;

        this.goFront(indx);

        if (this.lastCard === null) {
            this.lastCard = indx;
        }
        else{

            if (this.items[this.lastCard] === this.items[indx]){
                this.pairs--;
                this.states[this.lastCard] = this.states[indx] = StateCard.DONE;

                if (this.pairs <= 0){

                    if (this.mode === "mode1") {
                        alert(`Has guanyat amb ${this.score} punts!`);
                        window.location.assign("../");
                    }

                    if (this.mode === "mode2") {
                        clearInterval(this.timer);
                        this.level++;
                        alert(`Nivell superat! Ara passes al nivell ${this.level}`);
                        sessionStorage.removeItem('load');
                        window.location.reload();
                    }
                }
            }
            else {
                this.goBack(indx);
                this.goBack(this.lastCard);

                if (this.mode === "mode1") this.score -= 25;
                else this.score -= this.penalty;

                if (this.score <= 0){
                    alert ("Has perdut");
                    window.location.assign("../");
                }
            }

            this.lastCard = null;
        }
    },

    save: function(){

        let alias = localStorage.alias || prompt("Introdueix el teu nom:");

        if (!alias) {
            alert("Has d'introduir un nom!");
            return;
        }

        localStorage.alias = alias;

        let partida = {
            items: this.items,
            states: this.states,
            lastCard: this.lastCard,
            score: this.score,
            pairs: this.pairs,
            mode: this.mode,
            level: this.level,
            timeLeft: this.timeLeft,
            totalCards: this.totalCards,
            groupSize: this.groupSize,
            penalty: this.penalty
        };

        let totes = localStorage.partides ? JSON.parse(localStorage.partides) : {};

        totes[alias] = partida;

        localStorage.partides = JSON.stringify(totes);

        alert("Partida guardada correctament!");
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(() => Math.random() - 0.5);
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}

export function saveGame(){
    game.save();
}
