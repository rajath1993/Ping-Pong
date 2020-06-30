const canvas = document.getElementById("pong");


const context = canvas.getContext("2d");



function drawRect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}//function to draw the rectangle

function drawCircle(x,y,radius,color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,radius,0,Math.PI * 2,false);
    context.closePath();
    context.fill();
}//function to draw the circle

function drawText(text,x,y,color){
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text,x,y);
}//function the draw the text

function drawNet() {
    for(let i=0;i<=canvas.height;i+=16){
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}//function to draw the net

// drawRect(0,0,600,400,"green");
//let rectCount = 0;
// function render(){

//     drawRect(0,0,600,400,"green");
//     drawRect(rectCount,100,100,100,"black");
//     rectCount+=100;

// }

// setInterval(render,1000);//runs the render function every 1sec





const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width:10,
    height:100,
    color:"white",
    score:0,
    name:"user"
}//user object


const comp = {
    x:canvas.width-10,
    y:canvas.height/2-100/2,
    width:10,
    height:100,
    color:"white",
    score:0,
    name:"comp"
}//comp object


const net = {
    x:canvas.width/2-2/2,
    y:0,
    width:2,
    height:10,
    color:"White"
}//net at the middle of the canvas

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX:5,
    velocityY:5,
    color: "white"
}//ball object


function render() {
    
    drawRect(0,0,canvas.width,canvas.height,"Green");//clear the canvas
    drawText(user.score,canvas.width/4,canvas.height/5,"White");//user score
    drawText(comp.score,(canvas.width * 3)/4,(canvas.height/5),"White");//comp score
    drawNet();//draw the net
    drawRect(user.x,user.y,user.width,user.height,user.color);//user paddle
    drawRect(comp.x,comp.y,comp.width,comp.height,comp.color);//comp paddle
    drawCircle(ball.x,ball.y,ball.radius,ball.color);//ping pong ball
}//function to render the game

function game() {
    update();//Movements,collision detection,score update.
    render();
}

const framePerSecond = 50;
setInterval(game,1000/framePerSecond);//calls the game 50 times per second.

//control the paddle
canvas.addEventListener("mousemove",function (evt){
    let rect = canvas.getBoundingClientRect(); //gets the top of the canvas
    user.y = evt.clientY - rect.top - user.height/2;
});


//collision detection function
function collision(incomingBall,player){
    incomingBall.top = incomingBall.y - incomingBall.radius;
    incomingBall.bottom = incomingBall.y + incomingBall.radius;
    incomingBall.left = incomingBall.x - incomingBall.radius;
    incomingBall.right = incomingBall.x + incomingBall.radius;


    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    return incomingBall.right>player.left && incomingBall.left < player.right && incomingBall.bottom > player.top && incomingBall.top < player.bottom;

}

//function to reset the game
function resetGame(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}


//function update: pos,mov,score...
function update(){

    ball.y +=ball.velocityY;
    ball.x +=ball.velocityX;

    /*AI to control the com paddle */
    let compLevel = 0.08;
    comp.y += (ball.y - (comp.y+comp.height/2)) * compLevel; //follows the ball

    //console.log("computer: "+comp.y);

    /*ball.y + ball.radius - bottom of the ball, ball.y - ball.radius - top of the ball */
    if(ball.y + ball.radius>canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }
    /*ball.x + ball.radius - right of the ball, ball.x -0 ball.radius - left of the ball*/
    if(ball.x - ball.radius > canvas.width || ball.x + ball.radius < 0){
        ball.velocityX = -ball.velocityX;
    }

    let player = (ball.x < canvas.width/2)?user:comp;

    //console.log("name: ",player.name);


    if(collision(ball,player)){
        //console.log("true");
        //to check where the ball hit the paddle
        let collidePoint = ball.y - (player.y + player.height/2);
        let normalized = collidePoint/(player.height/2);

        let angleRad = normalized * Math.PI / 4;

        let direction = (ball.x<canvas.width/2)? 1 : -1;

        //change the velocityX and velocityY
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        //everytime the ball hits the paddle, we will increase the speed of the ball
        ball.speed += 0.5;
    }

    //update the score

    if(ball.x - ball.radius < 0){
        comp.score++;
        console.log("comp won");
        resetGame();
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        console.log("Player Won");
        resetGame();
    }

}





