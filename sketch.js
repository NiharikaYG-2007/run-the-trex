
var trex ,trex_running;
var gameState= 1

function preload(){
  trex_running= loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided= loadAnimation("trex_collided.png")

  ground_image= loadImage("ground2.png");
  cloud_image= loadImage("cloud.png");

  cactus1= loadImage("obstacle1.png");
  cactus2= loadImage("obstacle2.png");
  cactus3= loadImage("obstacle3.png");
  cactus4= loadImage("obstacle4.png");
  cactus5= loadImage("obstacle5.png");
  cactus6= loadImage("obstacle6.png");

  gameOver_img= loadImage("gameOver.png");
  restart_img= loadImage("restart.png");

  jump_s= loadSound("jump.mp3");
  die_s= loadSound("die.mp3");
  checkPoint_s= loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //create a trex sprite
  trex = createSprite(80,height-200,20,50);
  trex.addAnimation("run",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale= 0.6;
  trex.x=50

  //creating ground
  ground = createSprite(200,height-100,400,20);
  ground.addImage(ground_image);

  //invisible ground
  ground2 = createSprite(300,height-90,600,10);
  ground2.visible= false;

  //setting collider
  trex.debug= false;
  trex.setCollider("circle",0,0,50);

  score= 0;

  //creating groups
  cactusGroup= createGroup();
  cloudsGroup= createGroup();

  //giving gameover text
  gameOver= createSprite(width/2,height/2,10,10);
  gameOver.addImage(gameOver_img);
  gameOver.scale=0.7;

  //giving restart button
  restart= createSprite(width/2,height/2+50,10,10);
  restart.addImage(restart_img);
  restart.scale= 0.5;


}


function draw(){
  background("white");
  text("score="+score,width-100,50);
  
  trex.collide(ground2);

  
  drawSprites();


  if(gameState===1){
    score=score+Math.round(getFrameRate()/60);

    if(touches.length>0||keyDown("space")&& trex.y>height-155){
      trex.velocityY=-10;
      jump_s.play();
      touches=[];
    }
      gameOver.visible=false;
      restart.visible=false;
      ground.velocityX=-(3+score/100);

    if(ground.x<0){
      ground.x=ground.width/2;
    }
    if(score%200===0&&score>0){
      checkPoint_s.play();
    }
    spawnClouds();
    spawnCactus();
    if(cactusGroup.isTouching(trex)){
      gameState=2;
      die_s.play()
    //trex.velocityY=-12
    }
    
    trex.velocityY= trex.velocityY+0.5;
  
  }

  if(gameState===2){
    ground.velocityX=0;

    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cactusGroup.setLifetimeEach(-1);

    gameOver.visible=true;
    restart.visible=true;
    if(mousePressedOver(restart)){
      reset();
    }
    trex.velocityY= 0;
    trex.changeAnimation("collided");
  }
} 


function spawnClouds(){
  if(frameCount%60===0){
    cloud= createSprite(width,60,70,10);
    cloud.velocityX=-3
    cloud.addImage(cloud_image);
    cloud.scale= 0.5
    cloud.y= Math.round(random(100,200));
    cloud.lifetime=width/3;
    cloudsGroup.add(cloud);
    trex.depth= cloud.depth;
    trex.depth+=1;
      }
}

function spawnCactus(){
  if(frameCount%60===0){
    cactus= createSprite(width,height-120,10,40);
    
    cactus.velocityX= -(6+score/100);
    cactus.lifetime=width/3;
    cactusGroup.add(cactus);
    cactus.scale= 0.7;
    rand=Math.round(random(1,6));

    switch(rand){
    case 1:cactus.addImage(cactus1);
    break
    case 2:cactus.addImage(cactus2);
    break
    case 3:cactus.addImage(cactus3);
    break
    case 4:cactus.addImage(cactus4);
    break
    case 5:cactus.addImage(cactus5);
    break
    case 6:cactus.addImage(cactus6);
    break
    default:break
    }
  }
}

function reset(){
  gameState=1;
  cactusGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("run");
  score=0;
}