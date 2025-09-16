const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let color_car = '#000000'
let last_car = true;
let posion_car = [[true,true,false,true,true],[false,true,true,true,false],[false,true,true,true,false],[true,true,false,true,true],[false,false,true,false,false]]

let next_car;
let last_posion;
let space = 0

let zela = 30;
let timer_step = 0;
// // קחשמב דעצל ןמזה היהי המ
let static_time = 50; 
let stop = false;
let keysPressed = {};


function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function draw_rinbow(x, y, color) {
                ctx.fillStyle = color;
                ctx.fillRect(x + 2, y + 2, zela - 4, zela - 4)
                if (color == "transparent") {
                        ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)'; 
                }
                else {
                        ctx.strokeStyle = hexToRgba(color, 0.5)
                }
                ctx.lineWidth = 3; // width board
                ctx.strokeRect(x, y, zela, zela);
        };

function car(isCarOnLeft = true, row = 0) {
        // this.color = box.pop()
        // this.box = box;
        // [color, ...box] = box_with_color
        this.row = row;
        this.column = isCarOnLeft ? 0 : 5
        // this.full =  box_in_matrix(this.box, this.row, this.column)
        this.draw = function() {
                for (let row = 0; row < posion_car.length ; row++) {
                        for (let r = 0; r < posion_car[row].length; r++) {
                                if(posion_car[posion_car.length-1-row][r]){
                                        draw_rinbow((this.column * zela)+(r*zela), (this.row * zela) - ((posion_car.length-1-row)*zela), color_car)
                                }
                        }
                }
                // this.full = box_in_matrix(this.box, this.row, this.column)
        }

}

function rinbow(row, column, color = color_car) {
        this.row = row;
        this.column = column;
        this.color = color;
        this.draw = function() {
                draw_rinbow(this.column * zela, this.row * zela, this.color)
        }

}

function biludBoard() {
        matrix = [];
        for (let row = 0; ((row * zela) + zela) <= canvas.height; row++) {
                matrix[row] = [];
                for (let column = 0;  ((column * zela) + zela) <= canvas.width; column++) {
                        matrix[row][column] = new rinbow(row, column, 'transparent')  
                }
        }
}

function drowBoard() {
        for (let row = 0; row < matrix.length; row++) {
                for (let column = 0;  column < matrix[row].length; column++) {
                        matrix[row][column].draw()  
                }
        }
}

function biludCar(row = -1) {
        car_game = new car(false, row)
}

function buildGame() {
        last_posion = null;
        keysPressed = {};
        color_car = document.getElementById('colorPicker').value
        static_time = Math.floor(document.getElementById('mySelect').value);
        next_car = null;
        biludBoard()
        biludCar(matrix.length-1)
        continueGame()
    
}

function drowGame(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drowBoard()
        car_game.draw()
        if(next_car){
                next_car.draw()
        }
}

function downMatrix() {
        
        // יצירת שורה ריקה
        let emptyRow = Array.from({ length: matrix[0].length }, (_, i) => new rinbow(0, i, 'transparent'));

        // .map((_, i) => new rinbow(0, i, 'transparent'));;

        // להסיר את השורה האחרונה
        matrix.pop();

        // להוסיף את השורה הריקה בתחילת המערך
        matrix.unshift(emptyRow);

        matrix.forEach((rowRinbow, rowIndex) => {
                rowRinbow.forEach((rinbow, colIndex) => {
                    rinbow.row = rowIndex;
                    rinbow.column = colIndex;
                });
        })

}

function downBox(notCheck = false) {
        if(!stop) {
                if(notCheck){
                        if(timer_step % 10 == 0){
                                notCheck = false
                        }
                }
                putCar(notCheck)
                timer_step++;
                if (notCheck || timer_step == static_time) {
                        if(next_car){
                                next_car.row++;
                        }
                        
                        downMatrix()
                        
                        if(next_car){
                                if(next_car.row == 5){
                                        for(let im = next_car.column, ic = 0; ic < 5; ic++, im++) {
                                                for(r=0, rm=5; r<5; r++, rm--){
                                                        if(posion_car[r][ic]){
                                                                matrix[rm][im].color = color_car
                                                        }
                                                }
                                        }
                                        last_posion = next_car.column
                                        next_car=null;
                                }
                        }
                        if (timer_step == static_time) {
                                timer_step = 0
                        }
                        timer_step = 0
                } 
       }

}


function putCar(notCheck = false) {
        if(!next_car){
                let num = Math.random() < 0.5 ? 0 : 5
                if(last_posion == num && space == 0){
                        next_car = new car(num==0)       
                }
                else {
                        if(notCheck){
                                space += static_time
                        }
                        else {
                                space++
                        }
                        if(space >= (static_time * 6)){
                               next_car = new car(!last_posion==0)    
                               space = 0
                        }
                }
        }

}

function checkStopGame(){
        for (let row = 0; row < posion_car.length ; row++) {
                        for (let r = 0; r < posion_car[row].length; r++) {           
                                if(posion_car[posion_car.length-1-row][r] && matrix[car_game.row-(posion_car.length-1-row)][car_game.column+r].color == color_car){
                                        alertAndBuild("HOOOOOOOOO!!!!!!!!!!!")
                                        return;
                                        // draw_rinbow((this.column * zela)+(r*zela), (this.row * zela) - ((posion_car.length-1-row)*zela), color_car)
                                }
                        }
                }
}

function alertAndBuild(msg){
        alert(msg)
        buildGame()
}

function recalculate(time) {
        if(!stop){

                if (keysPressed['ArrowLeft']) {
                    if (car_game.column === 5){// && (time - lastHorizontalMoveTime) > horizontalInterval) {
                        car_game.column = 0;
                        //lastHorizontalMoveTime = time;
                    }
                }
                if (keysPressed['ArrowRight']) {
                    if (car_game.column === 0 ){//&& (time - lastHorizontalMoveTime) > horizontalInterval) {
                        car_game.column = 5;
                        //lastHorizontalMoveTime = time;
                    }
                }

                downBox(!!keysPressed['ArrowUp'])

                drowGame()
                checkStopGame()

        }
        requestAnimationFrame(recalculate);
}


function pauseGame() {
        stop = true
        removeEventsGame()
}
function continueGame() {
        addEventsGame()
        stop = false
}


function addEventsGame() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}
function removeEventsGame() {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
}

function onKeyDown(e) {
  // מונעים קריאות חוזרות מיותרות של handle כשמקש כבר לחוץ
  if (!keysPressed[e.code]) {
    keysPressed[e.code] = true;
  }
  // חשוב כדי למנוע גלילה של הדף בחצני חיצים
  if (['ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
}

function onKeyUp(e) {
  keysPressed[e.code] = false;
  if (['ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
}



// function addEventsGame() {
//     document.addEventListener('keydown', eventsKeydown);
//     document.addEventListener('keyup', eventsKeyup);
// }

// function removeEventsGame() {
//     document.removeEventListener('keydown', eventsKeydown);
//     document.removeEventListener('keyup', eventsKeyup);
// }

// function eventsKeydown(event) {
//     keysPressed[event.code] = true;
//     handleKeys();
//     event.preventDefault();
// }

// function eventsKeyup(event) {
//     keysPressed[event.code] = false;
// }

// function handleKeys() {
//     if (keysPressed['ArrowRight'] && car_game.column == 0) {
//         car_game.column = 5;
//     }

//     if (keysPressed['ArrowLeft'] && car_game.column == 5) {
//         car_game.column = 0;
//     }

//     if (keysPressed['ArrowUp']) {
//         downBox(true);
//     }

//     drowGame();
// }

buildGame()
recalculate()



