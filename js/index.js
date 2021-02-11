// Create JoyStick object into the DIV 'joyDiv'
var joy = new JoyStick('joyDiv');

let app;
let bullet;
let bgBack;
let bgMiddle;
let bgFront;
let bgX = 0;
let bgSpeed = 1;
let speed = 0;

app = new PIXI.Application({
  width: 1200,
  height: 700,
  backgroundColor: 0xAAAAAA
});

// create a texture from an image path
var gunTex = PIXI.Texture.fromImage('assets/images/airgun2 new.png');  
var carrotTex = PIXI.Texture.fromImage('assets/images/bullet.png');

// create a new Sprite using the texture
var bunny = new PIXI.Sprite(gunTex);

// center the sprite's anchor point
bunny.anchor.x = 0.5;  
bunny.anchor.y = 0.5;
bunny.zIndex = 100;

bunny.position.x = 150;  
bunny.position.y = 370;

// enemy
var enemy = new PIXI.Sprite.from("assets/images/chicken.png");
  enemy.anchor.set(0.5);
  enemy.x = app.view.width - 100;
  enemy.y = 600;

document.querySelector("#gameDiv").appendChild(app.view);

app.loader.baseUrl = "assets/images";
app.loader
    .add("bgBack", "parallax-forest-back-trees.png")
    .add("bgMiddle", "parallax-forest-middle-trees.png")
    .add("bgFront", "parallax-forest-front-trees.png");
app.loader.onComplete.add(initLevel);
app.loader.load();

function createEnemy() {
  var enemy = new PIXI.Sprite.from("assets/images/chicken.png");
  enemy.anchor.set(0.5);
  enemy.x = app.view.width - 100;
  enemy.y = 600;
  app.stage.addChild(enemy);
  enemy.x -= 1; 
}

function gameLoop(delta) {
  updateBg();
  // createEnemy();
  app.stage.addChild(enemy);
  enemy.x -= 1;  
}

function intersect() {
  let aBox = a.getBounds();
  let bBox = b.getBounds();

  return aBox.x + aBox.width > bBox.x &&
    aBox.x < bBox.x + bBox.width &&
    aBox.y + aBox.height > bBox.y &&
    aBox.y < bBox.y + bBox.height;
}

function initLevel() {
  bgBack = createBg(app.loader.resources["bgBack"].texture);
  bgMiddle = createBg(app.loader.resources["bgMiddle"].texture);
  bgFront = createBg(app.loader.resources["bgFront"].texture);

  app.stage.addChild(bunny);
  
  app.ticker.add(gameLoop);
  // app.ticker.add(createEnemy);
}

function createBg(texture) {
  let tiling = new PIXI.TilingSprite(texture, 1200, 800);
  tiling.position.set(0,0);
  app.stage.addChild(tiling);

  return tiling;
}

function updateBg() {
  bgX = (bgX - bgSpeed);
  bgFront.tilePosition.x = bgX;
  bgMiddle.tilePosition.x = bgX / 2;
  bgBack.tilePosition.x = bgX / 4;
  bgFront.zOrder = -1;
  bgMiddle.zOrder = -2;
  bgBack.zOrder = -3;
}

app.stage.interactive = true;

document.querySelector("body").addEventListener("keydown", function(e){  
  console.log(e.keyCode);
  if(e.keyCode == 87) {
    shoot(bunny.rotation, {
      x: bunny.position.x+Math.cos(bunny.rotation)*20,
      y: bunny.position.y+Math.sin(bunny.rotation)*20
    });
  }
})

var bullets = []; 
var enemies = []; 
var bulletSpeed = 5;

function shoot(rotation, startPosition){  
  console.log("Fire..");
  let bullet = new PIXI.Sprite(carrotTex);
  bullet.position.x = startPosition.x + 130;
  bullet.position.y = startPosition.y;
  bullet.rotation = rotation;
  app.stage.addChild(bullet);
  bullets.push(bullet);
}

function rotateToPoint(mx, my, px, py){  
  var self = this;
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  //var degrees = angle * 180/ Math.PI;
  return angle;
}

// start animating
animate();  
function animate() {  
  requestAnimationFrame(animate);

  // just for fun, let's rotate mr rabbit a little
  // bunny.rotation = rotateToPoint(app.renderer.plugins.interaction.mouse.global.x, app.renderer.plugins.interaction.mouse.global.y, bunny.position.x, bunny.position.y);
  bunny.rotation = rotateToPoint(joy.GetX() + 300, joy.GetY() + 300, bunny.position.x, bunny.position.y);

  var enemyTex = PIXI.Texture.fromImage('assets/images/chicken.png');
  let enemyZ = new PIXI.Sprite(enemyTex);
  enemyZ.position.x = app.view.width + 130;
  enemyZ.position.y = 0;
  app.stage.addChild(enemyZ);
  
  enemies.push(enemyZ);

  for(var b=bullets.length-1;b>=0;b--){
    bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;
  }
  // render the container
  app.renderer.render(app.stage);
}

var sprite;
function setup() {
  var rect = new PIXI.Rectangle(0, 175, 64, 64);
  var texture = PIXI.Texture.fromImage('assets/images/chicken running.png');
  texture.frame = rect;

  sprite = new PIXI.Sprite(texture);

    var idle = setInterval(function() {
        if(rect.x >= 64 * 3) rect.x = 0;
        sprite.texture.frame = rect;
        rect.x += 64;
    }, 500);

    sprite.vx = 3;
    app.stage.addChild(sprite);

    animationLoop();
}

function animationLoop () {
  requestAnimationFrame(animationLoop);
  
  app.renderer.render(app.stage);
}


