var g_timer = null;
class Game {
  constructor() {
    this.timer = 5;
    this.inProgress = true;
    this.moveMade = 0;
    this.currentTurn = Game.white; // white, black
    this.squares = new Array(9).fill().map(() => new Square());
    this.winner = null;
    this.wh = 3;
    this.possibilities = [];
  }

  clearTimer() {
    clearInterval(g_timer);
    this.timer = 5;
  }
  makeMove(i) {
    this.clearTimer();
    this.timerTick();
    // if no value
    if (this.inProgress && !this.squares[i].value) {
      this.squares[i].value = this.currentTurn;

      this.moveMade++;
      this.checkForWinner();

      this.changePlayer();
    }
  }

  changePlayer() {
    this.currentTurn =
      this.currentTurn === Game.white ? Game.black : Game.white;
  }

  checkForWinner() {
    if (this.moveMade > 2) {
      for (let winPos of this.possibilities) {
        let Xs = 0;
        let Os = 0;

        for (let posIndex of winPos) {
          if (this.squares[posIndex].value === "x") {
            Xs++;
          } else if (this.squares[posIndex].value === "o") {
            Os++;
          }
        }

        if (Xs === this.wh) {
          alert("X won!");
          this.restart();
          break;
        }

        if (Os === this.wh) {
          alert("O won!");
          this.restart();
          break;
        }
      }
      
      // check for tie
      if (this.moveMade === this.squares.length - 1) {
        alert("Draw!");
        this.restart();
      }
    }
  }

  restart() {
    this.inProgress = false;
    this.squares = [];
    this.possibilities = [];
    this.clearTimer();
    // this.wh = '';
    this.moveMade = 0;
    this.timer = "";
  }

  timerTick() {
    g_timer = setInterval(() => {
      this.timer--;
      // console.log(this.timer);
      if (this.timer <= 0) {
        this.changePlayer();
        this.clearTimer();
        this.timerTick();
      }
    }, 1000);
  }

  makeSquares(num) {
    return new Array(num).fill().map(() => new Square());
  }

  makePossibilities(userInput) {
    let _possibilities = [];
    let second = [];
    let m = userInput;
    let input = m * m - 1;
    let num = 0;
    // first
    for (let i = 0; i < input; i += m) {
      _possibilities.push(Array.from({ length: m }, (_, j) => (j += num)));
      num += m;
    }

    // second
    for (let i = 0; i < _possibilities.length; i++) {
      second.push(
        Array.from({ length: m }, (_, j) => j * _possibilities.length + i)
      );
    }

    // merge
    _possibilities.push(...second);

    // third
    _possibilities.push(Array.from({ length: m }, (_, j) => j * (m + 1)));

    _possibilities.push(Array.from({ length: m }, (_, j) => (j + 1) * m - 1));

    return _possibilities;
  }
}

Game.white = "x";
Game.black = "o";
