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

    // 
    totalCards: 2,   // 
    // 

    pairs: 2,        // 

    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },

    select: function(){

        
        // Llegim opcions guardades
        let savedOptions = localStorage.options && JSON.parse(localStorage.options);

        //  (2 = parelles, 3 = trios, 4 = quartets)
        let groupSize = 2;
        if (savedOptions && savedOptions.groupSize) {
            groupSize = parseInt(savedOptions.groupSize);
        }

        // Número símbols diferents
        if (savedOptions && savedOptions.pairs) {
            this.totalCards = parseInt(savedOptions.pairs);
        }
        // 


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

            // 
            // Agafem  símbols necessaris
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
            // 
        }
    },

    start: function(){
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

    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;

        this.goFront(indx);

        if (this.lastCard === null) {
            this.lastCard = indx; // Primera carta clicada
        }
        else{ // Teníem carta prèvia

            if (this.items[this.lastCard] === this.items[indx]){
                this.pairs--;
                this.states[this.lastCard] = this.states[indx] = StateCard.DONE;

                if (this.pairs <= 0){
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            }
            else {
                this.goBack(indx);
                this.goBack(this.lastCard);
                this.score -= 25;

                if (this.score <= 0){
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
