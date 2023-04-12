var trex, trexRunning, trexCollided;
var ground;
var groundImage;
var ground2;
var cloudImage, cloudsGroup;
var obs1, obs2, obs3, obs4, obs5, obs6, obstaclesGroup;
var score = 0;
const PLAY = 0;
const END = 1;
var gameState = PLAY;
var gameOver, gameOverImage
var restart, restartImage
var dead = false
var highscore = 0

function preload() {
  trexRunning = loadAnimation("./images/trex3.png", "./images/trex4.png");
  trexCollided = loadAnimation("./images/trex_collided.png")
  groundImage = loadImage("./images/ground2.png");
  cloudImage = loadImage("./images/cloud.png");
  obs1 = loadImage("./images/obstacle1.png");
  obs2 = loadImage("./images/obstacle2.png");
  obs3 = loadImage("./images/obstacle3.png");
  obs4 = loadImage("./images/obstacle4.png");
  obs5 = loadImage("./images/obstacle5.png");
  obs6 = loadImage("./images/obstacle6.png");
  gameOverImage = loadImage("./images/gameOver.png")
  restartImage = loadImage("./images/restart.png")
  jump = loadSound("./sounds/jump.mp3")
  die = loadSound("./sounds/die.mp3")
  points = loadSound("./sounds/checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collided",trexCollided)
  trex.scale = 0.5;
  trex.setCollider("rectangle",0,0,30,100,40)
  ground = createSprite(300, 180, 600, 20);
  ground.addImage(groundImage);
  ground.depth = trex.depth - 1;
  ground2 = createSprite(300, 190, 600, 10);
  ground2.visible = false;

  cloudsGroup = new Group()
  obstaclesGroup = new Group()

  gameOver = createSprite(300,100,20,20)
  gameOver.addImage(gameOverImage)
  gameOver.scale = 0.5
  gameOver.visible = false

  restart = createSprite(300,140,20,20)
  restart.addImage(restartImage)
  restart.scale = 0.5
  restart.visible = false

}
function draw() {
  background(190);

  if (trex.isTouching(obstaclesGroup)) {
    trex.changeAnimation("collided")
    if(!dead){
      die.play()
      dead = true
    }
    gameState = END
  }

  if (gameState == PLAY) {

ground.velocityX = -(3 + 3 *score/100)

    score = score + Math.round(getFrameRate() / 40);

    if(score%100 == 0){
      points.play()
    }

    if (keyDown("space") && trex.y > 160) {
      trex.velocityY = -15;
      jump.play()
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();
    spawnObstacles();
  }

  if (gameState == END) {
    ground.velocityX = 0
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    gameOver.visible = true
    restart.visible = true
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)

    if(mousePressedOver(restart)){
      reset()
    }

    if(highscore < score){
      highscore = score
    } 
  }
  textAlign(CENTER, CENTER);
  text("Score: " + score, 500, 25);
  text("HI:" + highscore, 430, 25);



  trex.velocityY += 1;
  trex.collide(ground2); 

  drawSprites();
}

function spawnClouds() {
  if (frameCount % 90 == 0) {
    var cloud = createSprite(600, 30, 20, 20);
    cloud.velocityX = -(3 + 3 *score/100)
    cloud.addImage(cloudImage);
    cloud.scale = random(0.5,1);
    cloud.y = random(50, 100);
    cloud.depth = trex.depth - 1;
    if(cloud.x < 0){
      cloud.destroy()
    }
    cloudsGroup.add(cloud)
  }
}

function spawnObstacles() {
  if (frameCount % 150 == 0) {
    var obstacle = createSprite(650, 170, 20, 30);
    obstacle.velocityX = -(3 + 3 *score/100)

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obs1);
        break;
      case 2:
        obstacle.addImage(obs2);
        break;
      case 3:
        obstacle.addImage(obs3);
        break;
      case 4:
        obstacle.addImage(obs4);
        break;
      case 5:
        obstacle.addImage(obs5);
        break;
      case 6:
        obstacle.addImage(obs6);
        break;
      default:
        break;
    }
    obstacle.depth = trex.depth - 1;
    obstacle.scale = 0.5
if(obstacle.x < 0){
  obstacle.destroy()
}
    obstaclesGroup.add(obstacle)
  }
}
function reset(){
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running")
  restart.visible = false
  gameOver.visible = false
  score = 0
  gameState = PLAY
}
