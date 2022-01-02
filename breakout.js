
let player, ball, violetBricks, yellowBricks, redBricks, cursors;

let gameStarted = false;

let openingText, gameOverText, playerWonText;


const config = {
  
  type: Phaser.AUTO,
  
  parent: 'game',
  width: 800,
  heigth: 640,
  scale: {
   
    mode: Phaser.Scale.RESIZE,
    
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
 
  scene: {
    preload,
    create,
    update,
  },
  
  physics: {
    default: 'arcade',
    arcade: {
      gravity: false
    },
  }
};


const game = new Phaser.Game(config);


function preload() {
  this.load.image('ball', 'ball.png');
  this.load.image('paddle', 'paddle.png');
  this.load.image('brick1', 'brick4.png');
  this.load.image('brick2', 'brick9.png');
  this.load.image('brick3', 'brick6.png');
  this.load.image('brick4', 'brick7.png');
  this.load.image('brick5', 'brick8.png');

}


function create() {
  
  player = this.physics.add.sprite(
    400, // x position
    570, // y position
    'paddle', // key of image for the sprite
  );

  ball = this.physics.add.sprite(
    400, // x position
    540, // y position
    'ball' // key of image for the sprite
  );


  violetBricks = this.physics.add.group({
    key: 'brick1',
    repeat: 4,
    immovable: true,
    setXY: {
      x: 80,
      y: 100,
      stepX: 160
    }
  });

 
  yellowBricks = this.physics.add.group({
    key: 'brick2',
    repeat: 3,
    immovable: true,
    setXY: {
      x: 160,
      y: 60,
      stepX: 160
    }
  });


  redBricks = this.physics.add.group({
    key: 'brick3',
    repeat: 4,
    immovable: true,
    setXY: {
      x: 80,
      y: 20,
      stepX: 160
    }
  });
  
  purpleBricks = this.physics.add.group({
    key: 'brick4',
    repeat: 3,
    immovable: true,
    setXY: {
      x: 160,
      y: 140,
      stepX: 160
    }
  });
  
  redBricks2 = this.physics.add.group({
    key: 'brick5',
    repeat: 8,
    immovable: true,
    setXY: {
      x: 80,
      y: 180,
      stepX: 80
    }
  });

  
  cursors = this.input.keyboard.createCursorKeys();

 
  player.setCollideWorldBounds(true);
  ball.setCollideWorldBounds(true);
  
  ball.setBounce(1, 1);

 
  this.physics.world.checkCollision.down = false;

 
  this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
  this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
  this.physics.add.collider(ball, redBricks, hitBrick, null, this);
  this.physics.add.collider(ball, purpleBricks, hitBrick, null, this);
  this.physics.add.collider(ball, redBricks2, hitBrick, null, this);

 
  player.setImmovable(true);
 
  this.physics.add.collider(ball, player, hitPlayer, null, this);

 
  openingText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    ' 按空白鍵開始遊戲 ',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '50px',
      fill: '#fff'
    },
  );

  openingText.setOrigin(0.5);

 
  gameOverText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    '遊戲結束',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '50px',
      fill: '#fff'
    },
  );

  gameOverText.setOrigin(0.5);

 
  gameOverText.setVisible(false);

  
  playerWonText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    '你贏了!',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '50px',
      fill: '#fff'
    },
  );

  playerWonText.setOrigin(0.5);

  
  playerWonText.setVisible(false);
}


function update() {
  // Check if the ball left the scene i.e. game over
  if (isGameOver(this.physics.world)) {
    gameOverText.setVisible(true);
    ball.disableBody(true, true);
  } else if (isWon()) {
    playerWonText.setVisible(true);
    ball.disableBody(true, true);
  } else {
    // Put this in so that the player doesn't move if no key is being pressed
    player.body.setVelocityX(0);

   
    if (cursors.left.isDown) {
      player.body.setVelocityX(-350);
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(350);
    }

   
    if (!gameStarted) {
      // The ball should follow the paddle while the user selects where to start
      ball.setX(player.x);

      if (cursors.space.isDown) {
        gameStarted = true;
        ball.setVelocityY(-200);
        openingText.setVisible(false);
      }
    }
  }
}


function isGameOver(world) {
  return ball.body.y > world.bounds.height;
}

function isWon() {
  return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() + purpleBricks.countActive() + redBricks2.countActive() == 0;
}


function hitBrick(ball, brick) {
  brick.disableBody(true, true);

  if (ball.body.velocity.x == 0) {
    randNum = Math.random();
    if (randNum >= 0.5) {
      ball.body.setVelocityX(150);
    } else {
      ball.body.setVelocityX(-150);
    }
  }
}

function hitPlayer(ball, player) {

  ball.setVelocityY(ball.body.velocity.y - 5);

  let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
  
  if (ball.x < player.x) {
    ball.setVelocityX(-newXVelocity);
  } else {
    ball.setVelocityX(newXVelocity);
  }
}
