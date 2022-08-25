//by anshula a
//matter.js vocab aliases
const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

//sprites
var engine, world;
var box1, pig1,pig3;
var backgroundImg,platform;
var bird, slingshot;

var gameState = "onSling";
var bg = "sprites/bg1.png";
var score = 0;

var birds = [];

function preload() {
    getBackgroundImg();
    
    //load sounds
    flySound = loadSound('bird_flying.mp3')
    clickSound = loadSound('bird_select.mp3')
    snortSound = loadSound('pig_snort.mp3')
}

function setup(){
    //setup
    var canvas = createCanvas(1200,400);
    engine = Engine.create();
    world = engine.world;

    //create things using classes
    ground = new Ground(600,height,1200,20);
    platform = new Ground(150, 305, 300, 170);
 
    box1 = new Box(700,320,70,70);
    box2 = new Box(920,320,70,70);
    pig1 = new Pig(810, 350);
    log1 = new Log(810,260,300, PI/2);

    box3 = new Box(700,240,70,70);
    box4 = new Box(920,240,70,70);
    pig3 = new Pig(810, 220);

    log3 =  new Log(810,180,300, PI/2);

    box5 = new Box(810,160,70,70);
    log4 = new Log(760,120,150, PI/7);
    log5 = new Log(870,120,150, -PI/7);

    bird = new Bird(200,50);
    bird2 = new Bird(150, 170);
    bird3 = new Bird(100, 170);
    bird4 = new Bird(50, 170);
    
    //push new birds into birds array
    birds.push(bird4);
    birds.push(bird3);
    birds.push(bird2);
    birds.push(bird);

    //log6 = new Log(230,180,80, PI/2);
    //create the slingshot using slingshot class
    slingshot = new SlingShot(bird.body,{x:200, y:50});
}

function draw(){
    //if backgroundImg exists, make the background that image
    if(backgroundImg){
        background(backgroundImg);
    }
    else{
        background(black)
    }
    
    //display the score(which is the amount of pigs killed)
    noStroke();
    textSize(35)
    fill("white")
    text("Score  " + score, width-300, 50)
    //setup
    Engine.update(engine);
    //strokeWeight(4);
    //display everyhting we created in function setup
    box1.display();
    box2.display();
    ground.display();
    pig1.display();
    pig1.score();
    log1.display();

    box3.display();
    box4.display();
    pig3.display();
    pig3.score();
    log3.display();

    box5.display();
    log4.display();
    log5.display();

    bird.display();
    bird2.display();
    bird3.display();
    bird4.display();

    platform.display();
    //log6.display();
    slingshot.display();    
}

//make the bird move with mouse when the mouse is dragged
//this is where the error is
function mouseDragged(){
    //if the bird is still on the slingshot then...
    if (gameState!=="launched"){
        //take the bird on the slingshot and set it's position to the mouse's
        Matter.Body.setPosition(birds[birds.length-1].body, {x: mouseX , y: mouseY});
        //use a force to propel it forward
        Matter.Body.applyForce(birds[birds.length-1].body, birds[birds.length-1].body.position, {x: 5, y: -5})
       // clickSound.play();
        return false;
    }
}
//I think the error is in the line Matter.Body.setPosition(birds[birds.length], {x: mouseX, y:mouseY});

//when you release your mouse, the bird should disconnect from the slingshot constraint
//this works
function mouseReleased(){
    //release the bird from the slingshot constraint
    slingshot.fly();
    //play a sound(which we loaded in function preload)
    flySound.play();
    birds.pop();
    //change the gamestate from onsling to launched
    gameState = "launched";
    return false;
}

function keyPressed(){
    //if you click the space key and the previous bird has been launched...
    if(keyCode === 32 && gameState === 'launched'){
        //if the birds array still has birds left in it(all the birds heven't been launched)
        if(birds.length>=0){ 
         //take the bird closest to the slingshot and move it into the slingshot
         Matter.Body.setPosition(birds[birds.length-1].body, {x: 200 , y: 50});
         //then.. apply a constraint to it
         slingshot.attach(birds[birds.length-1].body);
         //bird.trajectory = [];
         //change the gamestate from launched to onsling
         gameState = 'onSling';
         //play a sound(which we loaded earlier in function preload)
         clickSound.play();
    }
   }
}

//change the background based on the time
async function getBackgroundImg(){
     var response = await fetch("http://worldtimeapi.org/api/timezone/America/Bogota");
     var responseJSON = await response.json();

     var datetime = responseJSON.datetime;
     var hour = datetime.slice(11,13);
    
     if(hour>=06 && hour<=19){
         bg = "sprites/bg1.png";
     }
     else{
         bg = "sprites/bg2.jpg";
     }

    backgroundImg = loadImage(bg);
    console.log(backgroundImg);
}
