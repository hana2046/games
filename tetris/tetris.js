const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


let boxs = [
//riboh
                ['#1e1ec2', [true, true],[true, true]],
// pluse
                ['#ffc107', [false, true, false],[true, true, true]],
// zed
                ['#1ba7e6', [true, true, false],[false, true, true]],
                ['#ff00fa', [false, true, true],[true, true, false]],
// raish
                ['#4ede18', [true, false, false],[true, true, true]],
                ['#1bc1c2', [false, false, true],[true, true, true]],
// line
                ['#de1865', [true, true, true, true]]
        ]
let zela = 30;
let colors = []
let box_now
let matrix = [];
let timer_step = 0;
// קחשמב דעצל ןמזה היהי המ
let static_time = 60; 
let stop = false;

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

function box_in_matrix(box, y, x) {
        let full = []
                for (let row = 0; row < box.length ; row++) {
                        for (let r = 0; r < box[row].length; r++) {
                                if(box[box.length-1-row][r] 
                                        // && x + r > 0 && x + r < matrix[0].length
                                        // && y - (box.length - 1 - row) > 0 && y - (box.length - 1 - row) < matrix.length
                                        ){
                                        full.push([x + r, y - (box.length - 1 - row)])
                                }
                        }
                }
        return full;
}

function box(row = 0) {
        let box_with_color = boxs[Math.floor(Math.random() * boxs.length)]
        // this.color = box.pop()
        // this.box = box;
        // [color, ...box] = box_with_color
        this.color = box_with_color[0];
        this.box = box_with_color.slice(1);;
        this.row = row;
        this.column = parseInt((matrix[0].length - this.box[0].length)/2)
        this.full =  box_in_matrix(this.box, this.row, this.column)
        this.draw = function() {
                for (let row = 0; row < this.box.length ; row++) {
                        for (let r = 0; r < this.box[row].length; r++) {
                                if(this.box[this.box.length-1-row][r]){
                                        draw_rinbow((this.column * zela)+(r*zela), (this.row * zela) - ((this.box.length-1-row)*zela), this.color)
                                }
                        }
                }
                this.full = box_in_matrix(this.box, this.row, this.column)
        }

}

function rinbow(row, column, color = colors[Math.floor(Math.random() * colors.length)]) {
        this.row = row;
        this.column = column;
        this.color = color;
        this.draw = function() {
                draw_rinbow(this.column * zela, this.row * zela, this.color)
        }

}


function rotateMatrix(direction = 'right') {
    if (!box_now.box.length || !box_now.box[0].length) {
        return;
    }


    const rows = box_now.box.length;
    const cols = box_now.box[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (direction === 'right') {
                // rotate right
                rotated[c][rows - 1 - r] = box_now.box[r][c];
            } else {
                // rotate left
                rotated[cols - 1 - c][r] = box_now.box[r][c];
            }
        }
    }

    if(box_now.box[0].length < rotated[0].length && box_now.column + rotated[0].length > matrix[0].length){
        return
    }
    let full = box_in_matrix(rotated, box_now.row, box_now.column)
    if(full.some(subArray => subArray[0] < 0 || subArray[0] >= matrix[0].length))
        return;
    box_now.box = rotated;
}

function biludBoard() {
        matrix = [];
        for (let row = 0; ((row * zela) + zela) <= canvas.height; row++) {
                matrix[row] = [];
                for (let column = 0;  ((column * zela) + zela) <= canvas.width; column++) {
                        matrix[row][column] = new rinbow(row, column, "transparent")  
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

function biludBox() {
        box_now = new box(-1)
        // box_now.draw()
}

function buildGame() {
        colors = ['#ff00fa', '#1bc1c2', '#de1865', '#4ede18', '#1ba7e6', '#ffc107', '#1e1ec2']
        biludBoard()
        biludBox()
        continueGame()
    
}

function drowGame(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drowBoard()
        box_now.draw() 

}

function downBox() {
        if(!stop) {
                timer_step++;
                if (timer_step == static_time) {
                        if(!checkBoxInBoard([1, 0])){
                                box_now.row++;         
                        }
                        timer_step = 0
                } 
        }
}

function putBox() {
        if(timer_step > 10 && checkBoxInBoard([1, 0])) {
                if (box_now.full.some((v) => v[1] == -1)) {
                        alertAndBuild("HOOOOOOOOO!!!!!!!!!!!")
                        return;
                }
                else {
                        for(let i = 0; i < box_now.full.length; i++) {
                                matrix[box_now.full[i][1]][box_now.full[i][0]].color = box_now.color
                        }
                }
                biludBox()
        }
}
function checkBoxInBoard([add_row, add_column]) {
        let i;
         for(i = 0; i < box_now.full.length; i++){
                console.log(box_now.full.length, i)
                if((box_now.full[i][1] + add_row >= matrix.length )
                // if((box_now.full[i][1] + add_row >= 0 && (matrix[box_now.full[i][1] + add_row] == undefined || matrix[box_now.full[i][1] + add_row][box_now.full[i][0] + add_column] == undefined ))
                        || (box_now.full[i][0] + add_column >=0 &&  box_now.full[i][1] + add_row >=0 && matrix[box_now.full[i][1] + add_row][box_now.full[i][0] + add_column].color != "transparent")) {
                        return true;
                }
         }
         return false;
}

function checkRemoveLines(){
        for (let row = 0; row < matrix.length; row++) {
                let removeLine = true
                for (let column = 0;  column < matrix[row].length; column++) {
                        if(matrix[row][column].color === "transparent"){
                                removeLine = false;
                                break;
                        }
                }
                if (removeLine) {
                        // remove line in matrix
                        matrix.splice(row, 1)
                        // add new line in the top of matrtix
                        matrix.unshift(Array.from({ length: matrix[1].length}, () => new rinbow(0, 0, "transparent")));
                        // fix number row and column in matrix before drow rinbow....
                        matrix = matrix.map((element_row, index_row) => {return element_row.map((element, index_column) => {element.row = index_row; element.column = index_column; return element;})})
                        
                }
        }
}

function alertAndBuild(msg){
        alert(msg)
        buildGame()
}

function recalculate(time) {
        downBox()
        putBox()
        checkRemoveLines()
        drowGame()
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
        document.addEventListener('keydown', eventsKeydown)
}

function removeEventsGame() {
        document.removeEventListener('keydown', eventsKeydown)
}


function eventsKeydown(event) {
    switch(event.code) {
        case 'Space':
                rotateMatrix();
                break;
        case  'ArrowRight':
                if((box_now.column + box_now.box[0].length) < matrix[0].length && !checkBoxInBoard([0, 1])) {
                        box_now.column++;
                        drowGame()
                }
            break; 
        case  'ArrowLeft':
                if(box_now.column > 0 && !checkBoxInBoard([0, -1])) {
                        box_now.column-- ;
                        drowGame()
                }
            break; 
        case  'ArrowDown':
                if(!checkBoxInBoard([1, 0])) {
                    box_now.row++ ;
                    drowGame()
                }
            break; 
        default:
            return;  

    }
    
        event.preventDefault();


}

buildGame()
recalculate()



