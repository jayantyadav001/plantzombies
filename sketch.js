var back,sunimg,sungroup,enemygroup,coin=0;
var plant,plantgroup,zombies,enemy,enemyimg;
var ball,balimg,bulletgroup,score = 0;
var gameState="home";
var speed=300;

function preload()
{
    back = loadImage("images/background122.jpg")
    sunimg = loadImage("images/sunused.png");
    plantimg=loadAnimation("images/plant1.png","images/plant2.png","images/plant3.png");
    enemyimg = loadAnimation("images/1.png","images/2.png","images/3.png","images/4.png","images/5.png","images/6.png")
    ballimg = loadImage("images/ball.png")
    homescreenimg = loadImage("images/homescreen.jpg");
    endimg = loadImage("images/end game.jpg");
    zombiedeath=loadSound("sounds/415079__harrietniamh__video-game-death-sound-effect.wav");
    //backsound=loadSound("sounds/423296__timbre__loopable-excerpt-of-zalyx-s-freesound-423160.flac")
  }


function setup()
{
  createCanvas(innerWidth,innerHeight);
    
    if(gameState==="home")
    {
     
     // start=createButton("Start")
    start=createImg("images/start.png");
   //   start.style('background-color', col)
  
    }
    if(gameState==="play")
    {
      sungroup = new Group();
      plantgroup = new Group();
      bulletgroup = new Group();
      enemygroup = new Group();
  
    }
    
    if(gameState==="gameend")
    {
//      btnOk=createButton("OK");
        btnOk=createImg("images/restart.png")
    }

}

function draw()
 {
      
      if(gameState==="home")
      {
        home();
      }
      if(gameState==="play")
      {
       // backsound.play();
        play();
        for(var y=0;y<enemygroup.length;y++)
        {
          if(enemygroup[y].x<20)
          {
            gameState="gameend";
            destroygame();
            setup();
          }  
        }
      }

      if(gameState==="gameend")
      {
        backsound.stop();
        GameEnd();
      }
    drawSprites();
      
    
}



function energy()
{
    if(frameCount%100===0)
    {
      sun = createSprite(random(100,width/2),50)
      sun.addImage("sun",sunimg)
      sun.scale= 0.2;
      sun.velocityY = 1;
      sun.lifetime = height;
      sungroup.add(sun);
    }

    for(var i=0;i<sungroup.length;i++)
    {
      if(mousePressedOver(sungroup[i]))
      {
        coin+=25;
        sungroup[i].destroy();
      }
    }

}


function createPlant()
{
    plant = createSprite(40,120)
    plant.addAnimation("plant",plantimg)
    plant.scale= 2;
    coin=coin-100;
    plant.lives=3;
    plant.dragstate = 1;
    plantgroup.add(plant)  
  
}


function Zombies()
{
    if(frameCount%speed===0)
    {
      enemy = createSprite(width-150,random(90,height-200))
      enemy.addAnimation("enemy",enemyimg);
      enemy.scale = 1;
      enemy.setCollider("rectangle",0,15,60,140)
      enemy.velocityX = -1;
      enemy.lives = 3;
      if(score>=5) speed=speed*0.9;
      enemygroup.add(enemy)
      
    }
}


function Bullet(x,y)
{
   if(frameCount%100===0)
   { 
      bullet=createSprite(x,y,10,10);
      bullet.addImage("ball",ballimg) ;
      bullet.velocityX = 3.7
      bullet.scale = 0.5
      // bullet.debug = true;
      bullet.setCollider("circle",100,0,40)
      bulletgroup.add(bullet)
      
  }
}


function kill()
{
  for(var a = 0;a<bulletgroup.length;a++)
  {
    for(var b=0;b<enemygroup.length;b++)
    {
      if(bulletgroup[a].isTouching(enemygroup[b]))
      {
        enemygroup[b].lives--
        if(enemygroup[b].lives<= 0)
        {
           enemygroup[b].destroy()
           zombiedeath.play();
           score+=5;
        }   
        bulletgroup[a].lifetime =0;
        
        
      }
    }
  }
}

function home()
{
     background(homescreenimg);
  
     //start=createImg("start.png");
     start.position(130,30);
     start.size(200,150)
   
     
     textSize(35);
     text("Instructions !!",650,480);
     textSize(20);
     text("1. You have to survie the wave of Zombies",550,510);
     text("2. Collect the suns,after every four sun you will get a plant ",550,540);
     text ("3. Place them on the  grasspath to kill zombies",550,570);
     text("4. If the zombies crossed the grasspath you will lose the game",550,600);
 
     start.mousePressed(function(){
      start.hide(); 
      gameState="play";
      setup();       
     })
   
  }

  function GameEnd()
  {
    background(endimg);
    textSize(35);
     text("GAME OVER!",1020,180);
     text("Your Score is "+score,1010,300)
     btnOk.position(120,100);
     btnOk.size(150,100);
     btnOk.mousePressed(function(){
       btnOk.hide();
       score=0;
       speed=300;
       coin=0;
       gameState="home";
       setup();
     })

  }

  function destroygame()
  {
    bulletgroup.destroyEach();
    enemygroup.destroyEach();
    sungroup.destroyEach();
    plantgroup.destroyEach();
    
  }

  function play()
  {
    background(back); 
    Zombies();
    energy(); 

          if(coin>=100)
          {
            createPlant();
          
          }
          //Creating plants
          for(var i=0;i<plantgroup.length;i++)
          {
            if(plantgroup[i].dragstate===1)
            {

              if(mousePressedOver(plantgroup[i]))
              {
                plantgroup[i].x=mouseX;
                plantgroup[i].y=mouseY;
                break;
              }
              else
              {
                if(plantgroup[i].x>60)
                {
                  plantgroup[i].dragstate = 2
                }
              }
            }
          }
          

          //creating bullets
          for(var x=0;x<plantgroup.length;x++)
          {
            if(plantgroup[x].dragstate===2)
            {
              for(var y=0;y<enemygroup.length;y++)
              {
                if(plantgroup[x].isTouching(enemygroup[y]))
                {
                  enemygroup[y].x=plantgroup[x].x+200;
                  plantgroup[x].lives--;
                  if(plantgroup[x].lives<=0) plantgroup[x].lifetime=0;
                }
                else
                {
                  if (plantgroup[x].y-enemygroup[y].y<40&&plantgroup[x].y-enemygroup[y].y>-40)
                  {
                    Bullet(plantgroup[x].x,plantgroup[x].y);
                  }
                }
              }
          }
        }
        kill()
        textSize(25)
        fill("brown")
        text("Energy "+coin,20,40)
        text("Score "+score,width-150,40)
    
  }