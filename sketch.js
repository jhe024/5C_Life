
// create a square that can move around based on keyboard inputs wasd
// create a couple of blocks that demonstrate basic physics interactions
let player;
function setup()
{
  createCanvas(400, 400);
  player = new Sprite(200,200,50,50);

}

function draw() 
{
  background(220);
  camera.x = player.x;
  camera.y = player.y;
  player.vel.x = 0;
  player.vel.y = 0;
  camera.on();
  rectMode(CENTER);
  rect(300, 100, 50);

  if(kb.pressing('left'))
  {
    player.vel.x -= 1;
    // camera.moveTo(player.x, player.y, player.vel.x);
  }
  if(kb.pressing('right'))
  {
    player.vel.x += 1;
    // camera.moveTo(player.x, player.y, player.vel.x);
  }
  if(kb.pressing('up'))
  {
    player.vel.y -= 1;
    // camera.moveTo(player.x, player.y, player.vel.x);
  }
  if(kb.pressing('down'))
  {
    player.vel.y += 1;
    // camera.moveTo(player.x, player.y, player.vel.x);
  }

}
