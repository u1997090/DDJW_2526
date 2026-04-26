const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

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

    
    mode: "mode1",
    level: 1,
    timeLimit: 60,
    timeLeft: null,
    timer: null,
    groupSize: 2,
    penalty: 25,

    // DIFICULTAT PROGRESSIVA (MODE 2)
    applyDifficulty: function(level) {

        // Número de símbols (max 6)
        this.totalCards = Math.min(2 + level, 6);

        // Mida de grup sense límit
        this.groupSize = 2 + Math.floor(level / 2);

        // Temps reduït
        this.timeLimit = Math.max(20, 60 - level * 5);

        // Penalització creixent
        this.penalty = 25 + (level * 5);
    },

    //  GUARDA PUNTUACIÓ AL RÀNQUING
    saveRanking: function() {

        // Puntuació final
        let finalScore = this.score + (this.level * 50);
        if (this.timeLeft !== null) finalScore += this.timeLeft;

        let entry = {
            score: finalScore,
            level: this.level,
            date: new Date().toLocaleString()
        };

        // Llegir ranking
        let ranking = localStorage.ranking ? JSON.parse(localStorage.ranking) : [];

        // Afegir entrada
        ranking.push(entry);

        // Ordenar
        ranking.sort((a, b) => b.score - a.score);

        // Guardar
        localStorage.ranking = JSON.stringify(ranking);
    },

    select: function(){

        // Llegim opcions guardades
        let savedOptions = localStorage.options && JSON.parse(localStorage.options);

        // LLEGIR MODE
        let mode = "mode1";
        if (savedOptions && savedOptions.mode) {
            mode = savedOptions.mode;
        }
        this.mode = mode;

        //  MODE 2 → nivell inicial
        if (this.mode === "mode2") {
            this.level = 1;
        }

        // Mida de grup (Mode 1)
        let groupSize = 2;
        if (savedOptions && savedOptions.groupSize && this.mode === "mode1") {
            groupSize = parseInt(savedOptions.groupSize);
        }

        // Número de símbols (Mode 1)
        if (savedOptions && savedOptions.pairs && this.mode === "mode1") {
            this.totalCards = parseInt(savedOptions.pairs);
        }

        //  MODE 2 → aplicar dificultat
        if (this.mode === "mode2") {
            this.applyDifficulty(this.level);
            groupSize = this.groupSize;
        }

        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.lastCard = toLoad.lastCard;
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
        }
        else{ // Nova partida

            this.items = resources.slice();          
            shuffe(this.items);                      

            // Agafem símbols necessaris
            this.items = this.items.slice(0, this.totalCards);

            // Repetim segons mida grup
            let original = this.items.slice();
            for (let i = 1; i < groupSize; i++) {
                this.items = this.items.concat(original);
            }

            // Barregem
            shuffe(this.items);

            // Inicialitzem estats
            this.states = new Array(this.items.length);

            // Nombre de parelles a trobar
            this.pairs = this.items.length / 2;
        }
    },

    start: function(){

        //  MODE 2 → temporitzador
        if (this.mode === "mode2") {
            this.timeLeft = this.timeLimit;

            this.timer = setInterval(() => {
                this.timeLeft--;

                if (this.timeLeft <= 0) {
                    clearInterval(this.timer);

                    //  GUARDAR RÀNQUING
                    this.saveRanking();

                    alert("Temps esgotat! Has perdut.");
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

                    //  MODE 1 → final normal
                    if (this.mode === "mode1") {
                        alert(`Has guanyat amb ${this.score} punts!!!!`);
                        window.location.assign("../");
                    }

                    //  MODE 2 → següent nivell
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

                //  Penalització segons mode
                if (this.mode === "mode1") {
                    this.score -= 25;
                } else {
                    this.score -= this.penalty;
                }

                if (this.score <= 0){

                    if (this.mode === "mode2") {
                        clearInterval(this.timer);
                        this.saveRanking(); //  GUARDAR RÀNQUING
                    }

                    alert ("Has perdut");
                    window.location.assign("../");
                }
            }

            this.lastCard = null;
        }
    },

    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            lastCard: this.lastCard,
            score: this.score,
            pairs: this.pairs
        });

        let ret = false;

        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }

        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
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
