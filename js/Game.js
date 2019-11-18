var g_timer = null;
class Game {
  constructor() {
    this.timer = 5;
    this.inProgress = true;
    this.moveMade = 0;
    this.currentTurn = Game.white; // white, black
    this.squares = new Array(9).fill().map(() => new Square());
    this.winner = null;
  }


  clearTimer(){
    clearInterval(g_timer);
    this.timer = 5;
  }
  makeMove(i) {
    this.clearTimer();
    this.timerTick()
    // if no value
    if (this.inProgress && !this.squares[i].value) {
      this.squares[i].value = this.currentTurn;

      this.moveMade++;
      this.checkForWinner();

      this.changePlayer();
    } else {
      // show reset button
    }
  }

 changePlayer() {
    this.currentTurn =
        this.currentTurn === Game.white ? Game.black : Game.white;
  }

  checkForWinner() {
    var possibilities = [
      [0, 4, 8],
      [0, 3, 6],
      [2, 4, 6],
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [2, 5, 6],
      [1, 4, 7]
    ];

    possibilities.forEach(ps => {
      const [a, b, c] = ps;
      const sqA = this.squares[a];
      const sqB = this.squares[b];
      const sqC = this.squares[c];

      if (sqA.value && sqA.value === sqB.value && sqA.value === sqC.value) {
        this.inProgress = false; // finished
        this.winner = sqA.value; // white or black

        sqA.isHighlighted = sqB.isHighlighted = sqC.isHighlighted = true; // set all
        this.clearTimer();
      }
    });

    // check for tie
    if (this.moveMade === this.squares.length) {
      this.inProgress = false; // inProgress = false AND winner = null
      this.clearTimer();
    }
  }

  timerTick() {
    g_timer = setInterval(() => {
      this.timer--;
      // console.log(this.timer);
      if(this.timer <= 0){
        this.changePlayer();
        this.clearTimer();
        this.timerTick();
      }
    }, 1000);
  }
}

Game.white = "x";
Game.black = "o";
