var g_timer = null;
class Game {
  constructor() {
    this.timer = 30;
    this.moveMade = 0;
    this.currentTurn = Game.white;
    this.squares = new Array(15)
      .fill()
      .map(() => new Array(15).fill().map(() => 0));
    this.step = 40;
    this.canvas = document.getElementById("canvas");
    this.size = 640;
    this.ctx = this.canvas.getContext("2d");
    this.isWin = false;
    this.msg = "";
    this.img_b = new Image();
    this.img_w = new Image();
    this.hideTimer = false;
    this.whiteLength = 0;
    this.blackLength = 0;
  }

  makeMove(e) {
    if (!this.hideTimer) {
      this.clearTimer();
      this.timerTick();
    }
    if (this.isWin === true) {
      this.msg = "The game is over, please refresh and start again!";
      return 0;
    }

    let x = parseInt((e.clientX - 10 - 20) / 40);
    let y = parseInt((e.clientY - 10 - 20) / 40);
    // console.log(x, y);

    if (x < 0 || x >= 15 || y < 0 || y >= 15) {
      return;
    }

    
    if (this.squares[x][y] != 0) {
      this.msg = "You can't play chess in this position";
      return;
    }
    

    if (this.currentTurn === Game.white) {
      this.currentTurn = Game.black; 
      this.drawChess(1, x, y); 
    } else {
      this.currentTurn = Game.white; 
      this.drawChess(2, x, y); 
    }
    this.moveMade += 1;
    this.whiteLengthFn();
    this.blackLengthFn();
  }

  whiteLengthFn() {
    var white = 0;
    for(var item of this.squares){
	    white += item.filter(i => i === 1).length;
    }
    this.whiteLength = white;
  }

  blackLengthFn() {
    var black = 0;
    for(var item of this.squares){
	    black += item.filter(i => i === 2).length;
    }
    this.blackLength = black;
  }

  drawChess(num, x, y) {
    // Determine the image display position according to X and y, and let the image display in the middle of the crosshair. Because a grid is 40 and the image size is 30, 40-30 / 2 is equal to 25, so you need to add 25

    let x0 = x * this.step + 25;
    let y0 = y * this.step + 25;
    if (num == 1) {

      this.ctx.drawImage(this.img_w, x0, y0);
      this.squares[x][y] = 1; //White
    } else if (num == 2) {

      this.ctx.drawImage(this.img_b, x0, y0);
      this.squares[x][y] = 2; //Black
    }
    
    this.checkForWinner(num, x, y);
  }

  changePlayer() {
    this.currentTurn =
      this.currentTurn === Game.white ? Game.black : Game.white;
  }

  checkForWinner(num, x, y) {
    let LR = 0, // Left and right
        UD = 0, // Up and down
        TLB = 0, // Top left to bottom right
        TRB = 0; // Top right to bottom left

    // Left and right direction 
    //First, search from the click position to the left, add LR for the same color pieces, until the pieces are not of the same color, then jump out of the cycle
    for (let i = x; i >= 0; i--) {
      console.log('L', i);
      if (this.squares[i][y] != num) {
        break; // "jumps out" of a loop. 
      }
      LR++;
    }
    //Then search from the clicked position to the next right position. If the pieces of the same color LR are added by itself until the pieces of different colors are not added, the cycle will pop out
    for (let i = x + 1; i < 15; i++) {
      console.log('R', i);
      if (this.squares[i][y] != num) {
        break;
      }
      LR++;
    }

    // Up and down direction
    for (let i = y; i >= 0; i--) {
      if (this.squares[x][i] != num) {
        break;
      }
      UD++;
    }
    for (let i = y + 1; i < 15; i++) {
      if (this.squares[x][i] != num) {
        break;
      }
      UD++;
    }

    // Top left to bottom right
    for (let i = x, j = y; i >= 0, j >= 0; i--, j--) {
      if (i < 0 || j < 0 || this.squares[i][j] != num) {
        break;
      }
      TLB++;
    }
    for (let i = x + 1, j = y + 1; i < 15, j < 15; i++, j++) {
      if (i >= 15 || j >= 15 || this.squares[i][j] != num) {
        break;
      }
      TLB++;
    }

    // Top right to bottom left
    for (let i = x, j = y; i >= 0, j < 15; i--, j++) {
      if (i < 0 || j >= 15 || this.squares[i][j] != num) {
        break;
      }
      TRB++;
    }
    for (let i = x + 1, j = y - 1; i < 15, j >= 0; i++, j--) {
      if (i >= 15 || j < 0 || this.squares[i][j] != num) {
        break;
      }
      TRB++;
    }

    let str;
    if (LR >= 5 || UD >= 5 || TLB >= 5 || TRB >= 5) {
      if (num == 1) {
        str = "White wins, the game is over!";
      } else if (num == 2) {
        str = "Black chess wins, the game is over!";
      }
      this.msg = str;
      this.isWin = true;
    }
  }

  clearTimer() {
    clearInterval(g_timer);
    this.timer = 30;
  }

  timerTick() {
    g_timer = setInterval(() => {
      this.timer--;
      // console.log(this.timer);
      if (this.timer <= 0) {
        if (!this.hideTimer) {
          this.changePlayer();
          this.timerTick();
        }
        this.clearTimer();
      }
    }, 1000);
  }

  drawLine() {
    this.canvas.width = this.canvas.height = this.size;
    // this.ctx.strokeStyle = 'white';
    for (let i = 0; i < this.canvas.width / this.step; i++) {
      // 16
      // Draw vertical lines
      this.ctx.moveTo((i + 1) * this.step, 0);
      this.ctx.lineTo((i + 1) * this.step, this.canvas.height);
      // Draw horizontal line
      this.ctx.moveTo(0, (i + 1) * this.step);
      this.ctx.lineTo(this.canvas.width, (i + 1) * this.step);
      this.ctx.stroke();
    }
  }

  restart() {
    this.currentTurn = Game.white;
    this.isWin = false;
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.msg = "";
    this.squares = new Array(15)
      .fill()
      .map(() => new Array(15).fill().map(() => 0));
    this.whiteLength = 0;
    this.blackLength = 0;
    this.moveMade = 0;
    this.drawLine();
  }
}

Game.white = "white";
Game.black = "black";
