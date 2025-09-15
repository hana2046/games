const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let balls = [];
let ballsRemove = []
let ballsDown = []
let colors = [];
let radius = 30;
let numberRowInBoard = 5
let bubbleShooter = null;
let positionArrow = null;
// let timer = 0;
let lastTime = 0;
let newGameTime = 0;
let timeWindow = 0;
let pauseTime = 0
var timerInterval; 
var millisecond = 0;
let flag = true
let isAnimating = false;



function Ball(x, y, color = colors[Math.floor(Math.random() * colors.length)]) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;

        this.draw = function() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
        };

}

function biludBoard() {
        balls = [];
        for (let row = 0; (radius+(row*((radius*2)-(radius/4)))) <= canvas.height-(radius*2); row++) {
                balls[row] = [];
                for (let index = 0; ((2*radius+(radius*2*index))+((row%2)*radius)) <= canvas.width; index++) {
                        let ball = null
                        if (row < numberRowInBoard) {
                                ball = new Ball((radius+(radius*2*index))+((row%2)*radius), (radius+(row*((radius*2)-(radius/4)))))
                        }
                        else {
                                ball = new Ball((radius+(radius*2*index))+((row%2)*radius), (radius+(row*((radius*2)-(radius/4)))), "transparent")
                        }
                        balls[row][index] = ball    
                }
        }
}


function buildBubbleShooter() {
        bubbleShooter = new Ball(canvas.width/2, canvas.height-radius)

}

function buildGame() {
        flag = true
        millisecond = 0;
        pauseTime = 0;
        radius =  Math.floor(document.getElementById('mySelect').value);
        switch(radius){
        case 10:
                numberRowInBoard = 12;
                break;
        case 20:
                numberRowInBoard = 10;
                break;
        case 30:
                numberRowInBoard = 6;
                break;
        case 40:
                numberRowInBoard = 4
                break;
        }
        colors = ['#ff00fa', '#de1865', '#4ede18', '#1ba7e6', '#ffc107', '#1e1ec2']
        addCss()
        biludBoard()
        buildBubbleShooter()
        // addEventsGame()
        // pauseGame()
        cancelAnimationFrame(recalculate)

        continueGame()
        // isAnimating = true
        // cancelAnimationFrame(recalculate)
        // requestAnimationFrame(recalculate);
        // recalculate()
        // timer = 0;
        // timer()
}

function sipoa(x, y, to_x, to_y) {
        if((to_x - x) == 0)
                return null;
        return (to_y - y) / (to_x - x)
}
function cut_y(x, y, sipoa) {
        if (sipoa == null)
                return null
        return y - (x * sipoa)
}

function updateArrowShoot(e) {
        if(!bubbleShooter.shoot){
                let offsetY = e.offsetY
                if(e.offsetY >= bubbleShooter.y){
                        offsetY = bubbleShooter.y - 1
                }
                bubbleShooter.sipoa = sipoa(bubbleShooter.x, bubbleShooter.y, e.offsetX, offsetY) 
                bubbleShooter.cut_y = cut_y(bubbleShooter.x, bubbleShooter.y, bubbleShooter.sipoa)
                positionArrow = getNextPosition(bubbleShooter, 80)
        }
}

function updateShootBubble(e) {
        if(!bubbleShooter.shoot) {
                let offsetY = e.offsetY
                if(e.offsetY >= bubbleShooter.y){
                        offsetY = bubbleShooter.y - 1
                }
                bubbleShooter.sipoa = sipoa(bubbleShooter.x, bubbleShooter.y, e.offsetX, offsetY)  
                bubbleShooter.cut_y = cut_y(bubbleShooter.x, bubbleShooter.y, bubbleShooter.sipoa)
                bubbleShooter.shoot = true
                positionArrow = null;
      }
}

function checkPositionInBoard(x, y) {
        for (let row = 0; row < balls.length; row++) {
                if (y >= balls[row][0].y - radius
                                    && y < balls[row][0].y + radius
                        ) {
                        for (let index = 0; index < balls[row].length; index++) {
                                if (x >= balls[row][index].x - radius 
                                     && x < balls[row][index].x + radius
                                ) {
                                        return [row, index]                              
                                }
                        }
                        if (x < balls[row][0].x + radius) {
                                return [row, 0] 
                        }
                        else {
                                return [row, balls[row].length-1]
                        }
                }
        }
        return null;
}

function getNextPosition(ball, step = radius/2) {
        // let ball_sipoa = ball.sipoa
        // let ball_cut_y = ball.cut_y
        // let y = ball.y - step
        // let x = (y - ball_cut_y) / ball_sipoa
        // if (x <= 0 || x >= (canvas.width - radius)) {
        //         //nekodat kaze
        //         if (x <= 0) {x = 0}
        //         else {x = canvas.width - radius}
        //         y = (x * ball_sipoa) + ball_cut_y

        //         // sipoa 90 malot
        //         ball_sipoa = -1 / ball_sipoa
        //         ball_cut_y = cut_y(x, y, ball_sipoa)
        //         x = (y - ball_cut_y) / ball_sipoa
        // }
        // return {x, y, ball_sipoa, ball_cut_y}
        let ball_sipoa = ball.sipoa
        let ball_cut_y = ball.cut_y
        let x = ball.x
        let y = ball.y
        if  (ball_cut_y == null && ball_sipoa == null){
                y -= step
        }
        else {
                let add_y = (-Math.abs(ball_sipoa) * step)/Math.sqrt(Math.pow(ball_sipoa, 2)+1)
                y = add_y + ball.y
                x = (y - ball_cut_y) / ball_sipoa
                if (x <= radius || x >= (canvas.width - radius)) {
                //nekodat kaze
                if (x <= radius) {x = radius}
                        else {x = canvas.width - radius}
                        y = (x * ball_sipoa) + ball_cut_y

                        // // sipoa 90 malot
                        // ball_sipoa = -1 / ball_sipoa
                        // ball_cut_y = cut_y(x, y, ball_sipoa)

                        // sipoa miror
                        ball_cut_y = y - (ball_cut_y - y)
                        ball_sipoa = sipoa(x, y, 0, ball_cut_y)
                }  
        }
        
        return {x, y, ball_sipoa, ball_cut_y}
}

function removeBalls(checkBall, color, listRemoveBalls = [], listCheckBalls = []) {
        const checked = listCheckBalls.some(subArray => 
            subArray.every((val, index) => val === checkBall[index])
        );

        if(checked) {
                return [listRemoveBalls, listCheckBalls]
        }
        
        listCheckBalls.push(checkBall)

        const row = checkBall[0];
        const index = checkBall[1];

        if(balls[row][index].color != color){
                return [listRemoveBalls, listCheckBalls]
        }

        // listRemoveBalls.push(checkBall)
        listRemoveBalls.push({...balls[row][index]})

        var positionToChek = [
                [row, index - 1], 
                [row, index + 1], 
                [row - 1, index], 
                [row - 1, row % 2 === 0 ? index - 1 : index + 1],
                [row + 1, index], 
                [row + 1, row % 2 === 0 ? index - 1 : index + 1]
        ]

        for (let i = 0; i < positionToChek.length; i++) {
                const newRow = positionToChek[i][0];
                const newIndex = positionToChek[i][1];
                if(newRow >= 0 && newRow <  balls.length && newIndex >= 0 && newIndex < balls[newRow].length){
                        const [updatedListRemoveBalls, updatedListCheckBalls] = removeBalls(positionToChek[i], color, listRemoveBalls, listCheckBalls)
                        listRemoveBalls = updatedListRemoveBalls;
                        listCheckBalls = updatedListCheckBalls;
                }
        }
        return [listRemoveBalls, listCheckBalls]
}

function downBalls(checkBall, downTable, listCheckBalls){
        const checked = listCheckBalls.some(subArray => 
            subArray.every((val, index) => val === checkBall[index])
        );

        if(checked) {
                return 0
        }
        
        listCheckBalls.push(checkBall)

        const row = checkBall[0];
        const index = checkBall[1];

        var positionToChek = [
                [row, index - 1], 
                [row, index + 1], 
                [row - 1, index], 
                [row - 1, row % 2 === 0 ? index - 1 : index + 1],
                [row + 1, index], 
                [row + 1, row % 2 === 0 ? index - 1 : index + 1]
        ]

        const down = 0
        for (let i = 0; i < positionToChek.length; i++) {
                const newRow = positionToChek[i][0];
                const newIndex = positionToChek[i][1];
                if(newRow >= 0 && newRow <  downTable.length && newIndex >= 0 && newIndex < downTable[newRow].length){
                        down = downBalls(positionToChek[i], downTable, listCheckBalls)
                        if (down = 1) {
                                return 1
                        }
                }
        }

        return 0

}


function downBallsUnderRemoveBall() {
    const branches = [];

    function isConnectedToGround(x, y, visited) {
        if (x < 0 || x >= balls.length || y < 0 || y >= balls[x].length || balls[x][y].color === "transparent" || visited[x][y]) {
            return false;
        }

        visited[x][y] = true;
        if (x === 0) {
            return true;
        }

        const y_t = x % 2 === 0 ? y - 1 : y + 1;
        return isConnectedToGround(x, y - 1, visited) || // left
               isConnectedToGround(x, y + 1, visited) || // right
               isConnectedToGround(x - 1, y, visited) || // button
               isConnectedToGround(x - 1, y_t, visited) || // button left or right
               isConnectedToGround(x + 1, y, visited) || // top
               isConnectedToGround(x + 1, y_t, visited)   // top left or right
    }


    for (let i = 0; i < balls.length; i++) {
        for (let j = 0; j < balls[i].length; j++) {
                let visited = balls.map(row => Array(row.length).fill(false));
                if (balls[i][j].color != "transparent") {
                        if (!isConnectedToGround(i, j, visited)) {
                            branches.push({...balls[i][j]});
                            // balls[i][j].color = "transparent"
                        }
                }
        }
    }
    return branches;
}


// function downBallsUnderRemoveBall(bRemove) {
//     const branches = [];

//     function isConnectedToGround(x, y, visited, w = null) {
//         if (x < 0 || x >= balls.length || y < 0 || y >= balls[x].length || balls[x][y].color === "transparent" || visited[x][y]) {
//             return false;
//         }

//         visited[x][y] = true;
//         if (x === 0) {
//             return true;
//         }

//         const y_t = x % 2 === 0 ? y - 1 : y + 1;
//         return isConnectedToGround(x, y - 1, visited, "l") || // left
//                isConnectedToGround(x, y + 1, visited, "r") || // right
//                isConnectedToGround(x - 1, y, visited, "b") || // button
//                isConnectedToGround(x - 1, y_t, visited, "blr") || // button left or right
//                isConnectedToGround(x + 1, y, visited, "t") || // top
//                isConnectedToGround(x + 1, y_t, visited, "tlr")   // tp left or right
//     }


//     for (let i = 0; i < balls.length; i++) {
//         for (let j = 0; j < balls[i].length; j++) {
//                 let visited = balls.map(row => Array(row.length).fill(false));
//                 bRemove.map(([x, y]) => {visited[x][y] = true})
//                 if (balls[i][j].color != "transparent" && visited[i][j] != true) {
//                 if (!isConnectedToGround(i, j, visited)) {
//                     branches.push({...balls[i][j]});
//                     balls[i][j].color = "transparent"
//                 }
//             }
//         }
//     }
//     return branches;
// }

function colorExistInBoard(c) {
        for (let i = 0; i < balls.length; i++) {
                for (let j = 0; j < balls[i].length; j++) {
                        if(c.includes(balls[i][j].color)) {
                                var index = c.indexOf(balls[i][j].color)
                                c.splice(index, 1)
                        }
                        if(c.length == 0) {
                                return c
                        }
                }
        }
        return c
}

function addBallAndCheckRemove(exists_ball) {
        // balls[exists_ball[0]][exists_ball[1]].color = bubbleShooter.color
        // const listRemoveBalls = removeBalls(exists_ball, bubbleShooter.color)[0]
        // if(listRemoveBalls.length >=3) {
        //         ballsRemove.push(...listRemoveBalls)
        //         ballsDown = downBallsUnderRemoveBall(listRemoveBalls)
        //         if(!colorExistInBoard(bubbleShooter.color, listRemoveBalls)) {
        //                 var i = colors.indexOf(bubbleShooter.color)
        //                 colors.splice(i, 1)
        //         }

        // }
        balls[exists_ball[0]][exists_ball[1]].color = bubbleShooter.color
        ballsRemove = removeBalls(exists_ball, bubbleShooter.color)[0]
        if(ballsRemove.length >=3) {
                for (let i = 0; i < balls.length; i++) {
                        for (let j = 0; j < balls[i].length; j++) {
                                if(ballsRemove.some(b => b.x == balls[i][j].x && b.y == balls[i][j].y)) {
                                        balls[i][j].color = "transparent"
                                }
                        }
                }
                ballsDown = downBallsUnderRemoveBall()
                for (let i = 0; i < balls.length; i++) {
                        for (let j = 0; j < balls[i].length; j++) {
                                if(ballsDown.some(b => b.x == balls[i][j].x && b.y == balls[i][j].y)) {
                                        balls[i][j].color = "transparent"
                                }
                        }
                }
                let colorsDown = ballsDown.map(b => b.color)
                colorsDown.push(bubbleShooter.color)
                colorsDown = [...new Set(colorsDown)]
                var colorExists = colorExistInBoard(colorsDown)
                for(let i = 0 ; i < colorExists.length ; i++) {
                        var index = colors.indexOf(colorExists[i])
                        colors.splice(index, 1)
                }


        }
        else {
                ballsRemove = []
        }
}

function ShootBubble() {
        animationBalls()
        if (bubbleShooter && bubbleShooter.shoot) {
                exists_ball = checkPositionInBoard(bubbleShooter.x, bubbleShooter.y);
                const nextPositionWidthRadius = getNextPosition(bubbleShooter, radius)
                nextPosition_ball = checkPositionInBoard(nextPositionWidthRadius.x, nextPositionWidthRadius.y)
                // const nextPositionWidthRadius = getNextPosition(bubbleShooter)
                // nextPosition_ball = checkPositionInBoard(nextPositionWidthRadius.x, nextPositionWidthRadius.y)
                if (nextPosition_ball != null && balls[nextPosition_ball[0]][nextPosition_ball[1]].color != "transparent") {
                        if(exists_ball) {
                                addBallAndCheckRemove(exists_ball)
                        }
                        else {
                                alertAndBuild("HOOOOOOOOO!!!!!!!!!!!")
                        }
                        buildBubbleShooter()
                        return
                }
                // bubbleShooter.y = bubbleShooter.y - 5
                // bubbleShooter.x = (bubbleShooter.y - bubbleShooter.cut_y) / bubbleShooter.sipoa
                // if (bubbleShooter.x<= 0 || bubbleShooter.x >= (canvas.width - radius)) {
                //         //nekodat kaze
                //         if (bubbleShooter.x <= 0) {bubbleShooter.x = 0}
                //         else {bubbleShooter.x = canvas.width - radius}
                //         bubbleShooter.y = (bubbleShooter.x * bubbleShooter.sipoa) + bubbleShooter.cut_y

                //         // sipoa 90 malot
                //         bubbleShooter.sipoa = -1 / bubbleShooter.sipoa
                //         bubbleShooter.cut_y = cut_y(bubbleShooter.x, bubbleShooter.y, bubbleShooter.sipoa)
                //         bubbleShooter.x = (bubbleShooter.y - bubbleShooter.cut_y) / bubbleShooter.sipoa
                // }

                const nextPosition = getNextPosition(bubbleShooter)
                if(nextPosition.y <= 0) {
                        addBallAndCheckRemove(exists_ball)
                        buildBubbleShooter()
                }
                else {
                        bubbleShooter.sipoa = nextPosition.ball_sipoa
                        bubbleShooter.cut_y = nextPosition.ball_cut_y
                        bubbleShooter.x = nextPosition.x
                        bubbleShooter.y = nextPosition.y
                }
        }
}

function animationBalls() {
                // animation to remove ball
        // if (ballsRemove.length != 0) {
        //         let i = 0;
        //         for (i = 0; i < ballsRemove.length; i++) {
        //                 let b = ballsRemove[i]
        //                 balls[b[0]][b[1]].radius -= 3 
        //                 if (balls[b[0]][b[1]].radius <= 0) {
        //                         balls[b[0]][b[1]].radius = radius
        //                         balls[b[0]][b[1]].color = "transparent"
        //                         ballsRemove.splice(i, 1)
        //                         i--
        //                 }
        //         }
        // }
        if (ballsRemove.length != 0) {
                let i = 0;
                for (i = 0; i < ballsRemove.length; i++) {
                        ballsRemove[i].radius -= 3
                        if (ballsRemove[i].radius <= 0) {
                                ballsRemove.splice(i, 1)
                                i--
                        }
                }
        }

        // //animation to down ball
        if (ballsDown.length != 0) {
                let i = 0;
                for (i = 0; i < ballsDown.length; i++) {
                        ballsDown[i].y += radius/2 
                        if (ballsDown[i].y >= canvas.height) {
                                ballsDown.splice(i, 1)
                                i--
                        }
                }
        }
}
function drawArrow(arrowP){
        var fromx = bubbleShooter.x;
        var fromy = bubbleShooter.y;
        var tox = arrowP.x;
        var toy = arrowP.y;


    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
 
    ctx.save();
    ctx.strokeStyle = 'red';
 
    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = 3;
    ctx.stroke();
 
    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
 
    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //draws the paths created above
    ctx.stroke();
    ctx.restore();
}

function buildBord() {
        if(positionArrow !== null) {
                drawArrow(positionArrow)
        }
        bubbleShooter.draw()
        for (let row = 0; row < balls.length; row++) {
                for (let index = 0; index < balls[row].length; index++) {
                        if (balls[row][index]) {
                                balls[row][index].draw()
                        }
                }
        }
        for (i = 0; i < ballsDown.length; i++) {
                ballsDown[i].draw()
        }
        for (i = 0; i < ballsRemove.length; i++) {
                ballsRemove[i].draw()
        }



}
function winner() {
        // for (let row = 0; row < balls.length; row++) {
        //         for (let index = 0; index < balls[row].length; index++) {
        //                 if (balls[row][index]) {
        //                         balls[row][index].draw()
        //                 }
        //         }
        // }
        let index;
        for (index = 0; index < balls[0].length; index++) {
                if (balls[0][index].color != "transparent") {
                        break;
                }

        }
        if(index == balls[0].length && ballsDown.length == 0 && ballsRemove.length == 0) {
                alertAndBuild("winner!!!!!!!!! :)\n" + "after:" + document.getElementById('timer').innerHTML )
        }
}

function alertAndBuild(msg){
        alert(msg)
        buildGame()
}

function downTable() {
        var sec = Math.floor(millisecond / 1000)
        var s = sec % 60;
        var minutes = Math.floor(sec / 60)
        var m = minutes % 60;
        if (m % 2 == 0 && m != 0 && flag) {
                flag = false
                for (let i = 1; i <= balls.length; i++) {
                        for (let j = 0; j < balls[balls.length-i].length; j++) {
                                if (i <= balls.length -2) {
                                        balls[balls.length-i][j].color = balls[balls.length-2-i][j].color
                                }
                                else {
                                        balls[balls.length-i][j].color = colors[Math.floor(Math.random() * colors.length)]
                                }

                        }
                }
        }
        if (m % 2 != 0) {
                flag = true
        }
}

function recalculate(time) {
        if (!isAnimating) return;
        timeWindow = time || 0;

        winner()
        if(lastTime ){
                millisecond += (timeWindow - lastTime)
        }
        timer()
        ShootBubble()

        // downTable()

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        buildBord()
        lastTime = timeWindow;

        requestAnimationFrame(recalculate);
}


function addEventsGame() {
        canvas.addEventListener('click', updateShootBubble)


        canvas.addEventListener('mousemove', updateArrowShoot)
}

function removeEventsGame() {
        canvas.removeEventListener('click', updateShootBubble)


        canvas.removeEventListener('mousemove', updateArrowShoot)
}

var t = 0
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        pauseGame()
    } else {
        // אם הדף חוזר להיות גלוי, נחדש את הזמן
        // lastTime = performance.now(); // לאתחל את הזמן
        continueGame()
        // recalculate(t); // להתחיל את האנימציה
        // if(!isAnimating){
        //     isAnimating = true; 
        //     addEventsGame()
        //     recalculate(t)
        // }
    }
});
window.addEventListener('focus', continueGame);
window.addEventListener('blur', pauseGame);

function addCss(){
        var elementsBorder = document.getElementsByClassName("border");
        for (let el of elementsBorder) {
            el.setAttribute("style", "border-radius:".concat(radius,"px;"))
        }
}


function timer(){
        var sec = Math.floor(millisecond / 1000)
        var s = sec % 60;
        var minutes = Math.floor(sec / 60)
        var m = minutes % 60;
        var h = Math.floor(minutes / 60);
        document.getElementById('timer').innerHTML = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
}

function pauseGame() {
        console.log("dddddd")
        isAnimating = false;
        lastTime = 0
        removeEventsGame()
        // const svg = document.getElementById('mySVG');
        document.getElementById('stopSVG').style.display = 'none';
        document.getElementById('continueSVG').style.display = 'block';
}
function continueGame() {
        if(!isAnimating){
            isAnimating = true; 
            addEventsGame()
            requestAnimationFrame(recalculate);
            document.getElementById('stopSVG').style.display = 'block';
        document.getElementById('continueSVG').style.display = 'none';


        }
}

addEventsGame()
buildGame()






// // ======================
// function find_sipoa(x, y, to_x, to_y) {
//         return (to_y - y) / (to_x - x)
// }
// function find_cut_y(x, y, sipoa) {
//         return y - (x * sipoa)
// }

// function getNextPosition(step = 5) {
//         let sipoa = bubbleShooter.sipoa
//         let cut_y = bubbleShooter.cut_y
//         let y = bubbleShooter.y - step
//         let x = (y - cut_y) / sipoa
//         if (x <= 0 || x >= (canvas.width - radius)) {
//                 //nekodat kaze
//                 if (x <= 0) {x = 0}
//                 else {x = canvas.width - radius}
//                 y = (x * sipoa) + cut_y

//                 // sipoa 90 malot
//                 sipoa = -1 / sipoa
//                 cut_y = find_cut_y(x, y, sipoa)
//                 x = (y - cut_y) / sipoa
//         }
//         return {x, y, sipoa, cut_y}
// }
// function ShootBubble() {
//         if (bubbleShooter && bubbleShooter.shoot) {
//                 const point_next_ball = getNextPosition(radius*2)
//                 if(bubbleShooter.y <= 0 || point_next_ball.y <= 0 || isColorAtPosition(point_next_ball.x, point_next_ball.y)) {
//                         // bubbleShooter = new Ball(canvas.width/2, canvas.height-radius)
//                         console.log("fffff")
//                         bubbleShooter = new Ball(canvas.width/2, canvas.height-radius)
//                 }
//                 const point = getNextPosition()
//                 bubbleShooter.y = point.y;
//                 bubbleShooter.x = point.xx;
//                 bubbleShooter.sipoa = point.sipoa;
//                 bubbleShooter.cut_y = point.cut_y;

//         }

// }

// function isColorAtPosition(x, y, targetColor = "rgba(255, 0, 0, 0)") { //#00000000
//             const imageData = ctx.getImageData(x, y, 1, 1); // מקבל את צבע הפיקסל
//             console.log(imageData)
//             const [r, g, b, a] = imageData.data; // מוציא את ערכי הצבע
//             const color = `rgba(${r}, ${g}, ${b}, ${a})`;
//             console.log(color)
//             return color === targetColor; // משווה עם הצבע המבוקש
//         }
