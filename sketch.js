//global variables.
//gamestate variables.
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
//trex variables.
var trex, trex_running, trex_collided;
// ground variables.
var ground, groundImage;
var invisibleground;
//cloud variables.
var cloudImage;
var cloud;
//obstacles variables.
var obstacle;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
//score variable.
var score = 0;
//gameover variable.
var gameoverImage;
//reset variable
var resetImage;
// sounds variables.
var jumpsound, diesound ;//checkpointsound;

//preload function.
//use to load all the images into variables.
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverImage = loadImage("gameOver.png");
  resetImage = loadImage("restart.png");
  //sounds......
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  //checkpointsound = loadSound("checkPoint.mp3");
}

//setup function.
//use to create sprites and its properties.
function setup() {
  createCanvas(600, 200);

  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
   
  //creating invisible ground sprite
  invisibleground = createSprite(200,190,400,10);
  invisibleground.addImage("ground",groundImage);
  invisibleground.visible = false;
  
  //created obstacles and clouds group.
  obstaclesgroup = new Group();
  cloudsgroup = new Group();
  
  //debugging and setting collider.
  trex.debug = false;
  trex.setCollider("circle",0,0,35);
  //adding A.I to the trex.
  //trex has to jump when its sees the obstacle coming close
  //trex.setCollider("rectangle", 0, 0, 400, trex.height);
  
  // creating gameover.
  gameover = createSprite(300,100);
  gameover.addImage(gameoverImage);
  gameover.scale = 0.5
  
  //creating reset button.
  reset = createSprite(300,130);
  reset.addImage(resetImage);
  reset.scale = 0.5;
}

//draw function
//use to write everything that happens in the game.
function draw() {
  background("grey");
  text("Score: " +score,520,20);

 // console.log(trex.depth);

  //if... else if
  //defining sprite behaviour based on the gamestate 
  if(gamestate == PLAY)
    {
      //setting gameover visiblity and reset visiblity
      gameover.visible = false;
     ground.velocityX = -4;
      reset.visible = false;
      
      score = score+ Math.round(frameCount/60);
      //i dont want checkpoint sound.....
      //very annoying...
     // if(score>0 && score%100 == 0)
      //{
       // checkpointsound.play();
      //}
      
      
       if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

      //jump when the space button is pressed
  if (keyDown("space") && trex.y>=100) {     
    trex.velocityY = -10;  
jumpsound.play();
  }
    generateclouds(); 
      generateobstacles();
      if(obstaclesgroup.isTouching(trex))   
  {
    trex.velocityY = -10;
    
     gamestate = END;
   // diesound.play();
  }   
    }
  else if(gamestate == END)
    {
      ground.velocityX = 0;
      trex.changeAnimation("collided",trex_collided);
      obstaclesgroup.setVelocityXEach(0);
      cloudsgroup.setVelocityXEach(0);
      obstaclesgroup.setLifetimeEach(-1);
      cloudsgroup.setLifetimeEach(-1);
      trex.velocityY = 0;
      gameover.visible = true;
      reset.visible = true;
      if(mousePressedOver(reset))
    {
       restart();
    }
    }
  //gravity...........
  trex.velocityY = trex.velocityY + 0.8
  trex.collide(invisibleground);
  //console.log("This is the gamestate : " + gamestate);
  
  
  drawSprites();
}//end of draw function

//restart function
function restart()
{
  gamestate = PLAY;
  gameover.visible = false;
  reset.visible = false;
  cloudsgroup.destroyEach();
  obstaclesgroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}

//generating clouds
function generateclouds()
{
  //modulus operator is used to get the reminder in division 
   if(frameCount % 60 == 0){
  cloud = createSprite(600,100,40,10);
     cloud.addImage(cloudImage);
     //generating random no.s for cloud heights
     cloud.y = Math.round(random(10,60));
  cloud.velocityX = -3;
     cloud.scale = 0.5;
     //to adjust the depth
     cloud.depth = trex.depth;
     trex.depth = trex.depth+1;
cloud.lifetime = 200;
       //console.log(cloud.depth);
     cloudsgroup.add(cloud);
      }
  
  
} 
function generateobstacles(){
  
  if(frameCount % 80 == 0){
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 2* score/100);
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    //rand is a local var .
    var rand = Math.round(random(1,6));
    
    switch(rand)
      {  
        case 1 : obstacle.addImage(obstacle1);
           break;
        case 2 : obstacle.addImage(obstacle2);
           break;
        case 3 : obstacle.addImage(obstacle3);
           break;
        case 4.: obstacle.addImage(obstacle4);
           break;
        case 5 : obstacle.addImage(obstacle5);
           break;
        case 6 : obstacle.addImage(obstacle6);
          break;
          default:
          break;   
      }
    obstaclesgroup.add(obstacle);
  }
}