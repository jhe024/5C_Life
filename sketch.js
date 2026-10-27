let player;
let frary;
let estella;
let scc;
let road1;
let road2;
let road3;
let tree;
let bush;
let tiles = [];
let fraryDoor;
let state = 'explore';
let shahriari;
let fountainZone;
let fountainImg;

const mealFiles = {
  frary: ['frary bibimbap.jpeg', 'frary broccolini.jpeg', 'frary congee.jpeg', 'frary ramen.jpeg',
          'frary shrimp.jpeg', 'frary steak night.jpeg', 'frary valentines.jpeg'],
  frank: ['frank acai.jpeg', 'frank adobo.jpeg', 'frank chicken.jpeg', 'frank clam chowder.jpeg',
          'frank crab roll.jpeg', 'frank omlette.jpeg', 'frank yogurt.jpeg'],
  scripps: ['scripps bacon.jpeg', 'scripps calamari.jpeg', 'scripps cookies.jpeg', 'scripps green beans.jpeg',
            'scripps mushrooms.jpeg', 'scripps surfnturf.jpeg', 'scripps waffles.jpeg'],
};


const fraryMemories = {
  'bibimbap': 'I genuinely got like 4 bowls',
  'broccolini': 'hrmm. Very questionable.',
  'congee': 'A taste of home?',
  'ramen': 'Ts is so mid',
  'shrimp': 'I love shrimp',
  'steak night': 'I shed a tear for how good this is pt.2',
  'valentines': 'I shed a tear for how good this is',
};

const HALL_NAMES = { frary: 'Frary', frank: 'Frank', scripps: 'Scripps' };

const meals = { frary: [], frank: [], scripps: [] }; 
let deck;      
let choices = [];  
let picked = -1;   
let score = 0;
let round = 0;
let quizOver = false;

const LEFT = -350, RIGHT = 600, TOP = -200, BOTTOM = 800;

function preload() 
{
  tiles[0] = loadImage('assets/tile1.PNG');
  tiles[1] = loadImage('assets/tile2.PNG');
  tiles[2] = loadImage('assets/tile3.PNG');
  tiles[3] = loadImage('assets/tile4.PNG');
  loadMeals();
  fountainImg = loadImage('assets/fountain2.jpeg');
}
const SPEED = 2;
const areas = [
  { x: -382, y: 400, w: 9.5, h: 4 }, 
];
function setup()
{

  createCanvas(480, 270, 'pixelated');
  allSprites.debug = false;
  // player sprite
  player = new Sprite(250, 300, 14);
  player.addAni('down', 'assets/xitlaly_chibi.png');
  player.addAni('up', 'assets/xitlaly_back.png');
  player.addAni('left', 'assets/xitlaly_side_left.png');
  player.addAni('right', 'assets/xitlaly_side.png');
  player.rotationLock = true;
  player.friction = 0;

  shahriari = new Sprite(200, 250, 14);
  shahriari.image = 'assets/prof_sprite.png';

  fountainZone = new Sprite(73, 555, 140, 'none');
  fountainZone.visible = false;
  // frary sprite
  frary = new Sprite(398, 96, 49, 140, 'static');
  frary.image = 'assets/frary_pixel.png';
  frary.image.offset.y = -20 / 2;
  frary.scale = 2.5;

  estella = new Sprite(0, 200, 200, 60, 'static');
  estella.image = 'assets/Estella.PNG';
  estella.image.offset.y = -18 / 2;
  estella.image.offset.x = 20 / 2;
  estella.addCollider(85, -45, 30, 30);
  estella.addCollider(-85, -53, 40, 43);
  estella.addCollider(-83, 33, 40, 10);
  estella.scale = 2;

  scc = new Sprite(20, 550, 0, 0, 'static');
  scc.image = 'assets/SCC.PNG';
  scc.image.offset.y = -20 / 2;
  scc.addCollider(-70, -10, 80, 160);
  scc.addCollider(-65, 55, 120, 120);
  scc.addCollider(-72, -65, 67, 100);
  scc.addCollider(55, -85, 140, 50);
  scc.addCollider(85, 36, 25);
  scc.scale = 1.4

  road1 = new Sprite(220, 0, 256, 256, 'none');
  road1.layer = 0;
  road1.image = 'assets/Road.PNG';
  road1.scale = 3;
  road1.rotation = 90;

  road2 = new Sprite(0, 380, 256, 256, 'none');
  road2.layer = 0;
  road2.image = 'assets/Road.PNG';
  road2.scale = 3

  road3 = new Sprite(256, 380, 256, 256, 'none');
  road3.layer = 0;
  road3.image = 'assets/Road.PNG';
  road3.scale = 3

  bush = new Sprite(120, 640, 0, 0, 'none');
  bush.image = 'assets/bush2.PNG';
  bush.scale = 0.7

  randomSeed(7);         
  areas.forEach(buildArea);

  fraryDoor = new Sprite(400, 280, 30, 16, 'none');
  fraryDoor.visible = false;

  allSprites.autoDraw = false;
}

function draw() 
{
    background('#639c4a');

  if (state === 'explore') 
  {
    movement();
    player.x = constrain(player.x, LEFT, RIGHT);
    player.y = constrain(player.y, TOP, BOTTOM);        
  } 
  else 
  {
    player.vel.x = 0;        
    player.vel.y = 0;
  }

  camera.x = player.x;
  camera.y = player.y;


  camera.on();
  for (const a of areas) image(a.gfx, a.x, a.y);
  allSprites.draw();
  camera.off();


  if (state === 'explore') 
  {
    if (player.overlapping(fraryDoor)) 
    {
      drawPrompt('Press E to enter Frary');
      if (kb.presses('e'))
      {
        startQuiz();
        state = 'frary';
      }
    }
    if(player.overlapping(fountainZone))
    {
      drawPrompt('Press E to look at the fountain');
      if(kb.presses('e'))
      {
        state = 'fountain';
      }
    }
  } 
  else if (state === 'frary') 
  {
    updateQuiz();
    drawFraryScreen();
    if (kb.presses('escape')) 
    {
      state = 'explore';
      player.y += 24;      
    }
  }
  else if(state === 'fountain')
  {
    drawFountainScreen();
    if(kb.presses('e') || kb.presses('escape'))
    {
      state = 'explore';
    }
  }

}

function pickTile() 
{
  const r = random();
  if (r < 0.7) return tiles[0];
  if (r < 0.8) return tiles[1];
  if (r < 0.9) return tiles[2];
  return tiles[3];
}

function buildArea(a) 
{
  const T = tiles[0].width;
  const g = createGraphics(a.w * T, a.h * T);
  g.pixelDensity(1);  
  g.noSmooth();    
  for (let i = 0; i < a.w; i++) {
    for (let j = 0; j < a.h; j++) {
      g.image(pickTile(), i * T, j * T);
    }
  }
  a.gfx = g;   
}

function movement()
{
  player.vel.x = 0;
  player.vel.y = 0;

  if(kb.pressing('left'))
  {
    player.vel.x -= SPEED;
    if(player.ani.name !== 'left')
    {
      player.changeAni('left');
    }
  }
  if(kb.pressing('right'))
  {
    player.vel.x += SPEED;
    if(player.ani.name !== 'right')
    {
      player.changeAni('right');
    }
  }
  if(kb.pressing('up'))
  {
    player.vel.y -= SPEED;
    if(player.ani.name !== 'up')
    {
      player.changeAni('up');
    }
  }
  if(kb.pressing('down'))
  {
    player.vel.y += SPEED;
    if(player.ani.name !== 'down')
    {
      player.changeAni('down');
    }
  }
  // camera zoom toggle
  if(kb.presses('z'))
  {
    if(camera.zoom == 1)
    {
      camera.zoom = 0.25;
      return;
    }
    camera.zoom = 1;
  }
}

function drawPrompt(msg)
{
  noStroke();
  fill(0, 180);
  rect(width / 2 - 90, height - 40, 180, 24, 6);
  fill(255);
  textSize(10);
  textAlign(CENTER, CENTER);
  text(msg, width / 2, height - 28);
}

function loadMeals() 
{
  for (const hall in mealFiles) {
    for (const file of mealFiles[hall]) {
      meals[hall].push({
        img: loadImage(`assets/${hall}/${file}`),
        hall,
        name: file.replace(hall + ' ', '').replace('.jpeg', ''),
      });
    }
  }
}

function startQuiz() {
  deck = {};
  for (const hall in meals) deck[hall] = shuffle(meals[hall].slice());
  score = 0;
  round = 0;
  quizOver = false;
  newRound();
}

function newRound() {
  if (deck.frary.length === 0) { quizOver = true; return; }
  choices = shuffle([deck.frary.pop(), deck.frank.pop(), deck.scripps.pop()]);
  picked = -1;
  round++;
}

function updateQuiz() {
  if (quizOver) {
    if (kb.presses('e')) startQuiz();
    return;
  }
  if (picked === -1) {
    // choosing
    for (let i = 0; i < 3; i++) {
      if (kb.presses(String(i + 1))) {
        picked = i;
        if (choices[i].hall === 'frary') score++;
      }
    }
  } else {
    if (kb.presses('e')) newRound();
  }
}

function drawFraryScreen() {
  // dark overlay over the world
  noStroke();
  fill(20, 20, 30, 235);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);

  if (quizOver) {
    textSize(16);
    text(`You found ${score}/7 Frary meals!`, width / 2, height / 2 - 12);
    textSize(9);
    text('E: play again    Esc: leave', width / 2, height / 2 + 16);
    return;
  }

  textSize(13);
  text('Which one is the Frary meal?', width / 2, 20);
  textSize(8);
  text(`Round ${round}/7   Score ${score}`, width / 2, 36);

  // three photos in a row
  const size = 120, gap = 20;
  const startX = (width - (3 * size + 2 * gap)) / 2;
  const y = 50;

  for (let i = 0; i < 3; i++) {
    const x = startX + i * (size + gap);
    const m = choices[i];

    if (picked !== -1) {
      if (m.hall === 'frary') fill(80, 200, 120);
      else if (i === picked) fill(220, 80, 80);
      else fill(60);
      rect(x - 3, y - 3, size + 6, size + 6);
    }

    drawCover(m.img, x, y, size, size);

    fill(255);
    textSize(10);
    text(picked === -1 ? `[${i + 1}]` : `${HALL_NAMES[m.hall]}: ${m.name}`, x + size / 2, y + size + 10);
  }

  // message area
  textSize(9);
  let msg;
  if (picked === -1) {
    msg = 'Press 1, 2 or 3';
  } else {
    const p = choices[picked];
    if (p.hall === 'frary') {
      msg = `Yes! ${p.name}. ${fraryMemories[p.name] || ''}`;
    } else {
      msg = `Nope, that's the ${p.name} from ${HALL_NAMES[p.hall]}!`;
    }
    msg += '   (E: next)';
  }
  text(msg, 20, y + size + 22, width - 40, 40); 

  textSize(7);
  text('Esc: leave', width / 2, height - 8);
}

function drawCover(img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const sw = w / s, sh = h / s;
  const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
  image(img, x, y, w, h, sx, sy, sw, sh);
}

function drawFountainScreen() {
  noStroke();
  fill(20, 20, 30, 235);                 // same dark overlay as Frary
  rect(0, 0, width, height);

  drawCover(fountainImg, (width - 240) / 2, 20, 240, 180);   // centered photo

  fill(255);
  textAlign(CENTER, TOP);
  textSize(9);
  text("Dunking Xitlaly at the Coop Fountain!!!", 30, 210, width - 60, 40);  // wraps

  textSize(7);
  textAlign(CENTER, CENTER);
  text('E / Esc: close', width / 2, height - 8);
}