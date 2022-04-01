// store canvas view
const canvas = document.querySelector('canvas');
const context_view = canvas.getContext('2d');
// background sprite
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background/background.png'
})
// shop sprite
const shop = new Sprite({
    position: {
        x: 640,
        y: 160,
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    framesMax: 6,
    frameCurrent: 0,
    framesElapsed: 0,
    framesHold: 20,
})
// game variables
const gravity = 0.5;
let timer = 121;
let timerId;
let gameover = false;
let increasedWin = false;
//  key objects used for player movement
const keys = {
    a : {
        pressed: false
    },

    d : {
        pressed: false
    },

    w: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },

    ArrowUp: {
        pressed: false
    }
}
// resize canvas
canvas.width = 1024;
canvas.height = 576;
context_view.fillRect(0, 0, canvas.width, canvas.height);

// create players
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },

    velocity: {
        x: 0,
        y: 0
    },

    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/character/player1/Idle_right.png',
    scale: 2.5,
    framesMax: 8,
    framesHold: 10,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle_right: {
            imageSrc: './img/character/player1/Idle_right.png',
            framesMax: 8,
        },
        idle_left: {
            imageSrc: './img/character/player1/Idle_left.png',
            framesMax: 8,
        },
        run_right: {
            imageSrc: './img/character/player1/Run_right.png',
            framesMax: 8,
        },
        run_left: {
            imageSrc: './img/character/player1/Run_left.png',
            framesMax: 8,
        },
        attack: {
            imageSrc:  './img/character/player1/Attack_left.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc:  './img/character/player1/Hit_right.png',
            framesMax: 4,
        },
        death: {
            imageSrc:  './img/character/player1/Death_left.png',
            framesMax: 6,
        },    
    },
    hitBox: {
        hitBoxOffset: {
            x: 100,
            y: 50,
        },
        width: 160,
        height: 50
    }
});

const player2 = new Fighter({
    position: {
        x: 950,
        y: 0
    },

    velocity: {
        x: 0,
        y: 0
    },

    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/character/player2/Idle_left.png',
    scale: 2.5,
    framesMax: 8,
    framesHold: 10,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle_right: {
            imageSrc: './img/character/player2/Idle_right.png',
            framesMax: 8,
        },
        idle_left: {
            imageSrc: './img/character/player2/Idle_left.png',
            framesMax: 8,
        },
        run_right: {
            imageSrc: './img/character/player2/Run_right.png',
            framesMax: 8,
        },
        run_left: {
            imageSrc: './img/character/player2/Run_left.png',
            framesMax: 8,
        },
        attack: {
            imageSrc:  './img/character/player2/Attack_left.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc:  './img/character/player2/Hit_left.png',
            framesMax: 4,
        },
        death: {
            imageSrc:  './img/character/player2/Death_left.png',
            framesMax: 6,
        },     
    },

    hitBox: {
        hitBoxOffset: {
            x: -160,
            y: 50,
        },
        width: 160,
        height: 50
    }
});

// animations for players
function animate() {
    window.requestAnimationFrame(animate);
    context_view.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    player2.update();
    player.velocity.x = 0;
    player2.velocity.x = 0;


    /*Player movements for sprites*/
    
    //movements of player 1
    switch (true) {
        case keys.a.pressed && player.lastkey === 'a' && (!(player.position.x < 0)): 
            player.velocity.x = -3
            player.switchSprite('run_left', 1);
            changeHitbox('left', 1);
        break;

        case keys.d.pressed && player.lastkey === 'd' && (!( player.position.x > 955)) :
            player.velocity.x = 3
            player.switchSprite('run_right', 1);
            changeHitbox('right', 1);
        break;

        case player.lastkey === 'a':
            player.switchSprite('idle_left', 1);
            changeHitbox('left', 1);
        break;

        case player.lastkey === 'd':
            player.switchSprite('idle_right', 1);
            changeHitbox('right', 1);
        break;
    }
    
    //movements of player 2
    switch (true) {
        case keys.ArrowLeft.pressed && player2.lastkey === 'ArrowLeft' && (!(player2.position.x < 0)) :
            player2.velocity.x = -3
            player2.switchSprite('run_left', 2);
            changeHitbox('left', 2);
        break;

        case keys.ArrowRight.pressed && player2.lastkey === 'ArrowRight' && (!( player2.position.x > 955)) :
            player2.velocity.x = 3
            player2.switchSprite('run_right', 2);
            changeHitbox('right', 2);
        break;

        case player2.lastkey === 'ArrowLeft':
            player2.switchSprite('idle_left', 2);
            changeHitbox('left', 2);
        break;

        case player2.lastkey === 'ArrowRight':
            player2.switchSprite('idle_right', 2);
            changeHitbox('right', 2);
        break;
        
    }
  

    /*End of the player movements section*/

    // player 2 gets hit
    if (
        collisionCheck(
            player,
            player2,
        ) &&
        player.isAttacking && player.frameCurrent === 4
    ) {
        player.isAttacking = false;
        if (!gameover){
            player2.takeHit();
        }
        gsap.to('#player2_current_health', {
            width: player2.health + "%"
        });
        if (player.health <= 0 || player2.health <= 0) {
            determineWinner({player, player2, timerId});
        }
    }

    // if player 1 misses
    if (player.isAttacking && player.frameCurrent === 4) {
        setTimeout(() => {
            player.isAttacking = false;
        }, 100);
    }

    // if player 2 misses
    if (player2.isAttacking && player2.frameCurrent === 4) {
        setTimeout(() => {
            player2.isAttacking = false;
        }, 100);
    }

    // player 1 gets hit
    if (
        collisionCheck(
            player2,
            player,
        ) &&
        player2.isAttacking && player2.frameCurrent === 4
    ) {
        player2.isAttacking = false;
        if (!gameover){
            player.takeHit();
        } 
        gsap.to('#player1_current_health', {
            width: player.health + "%"
        });
        if (player.health <= 0 || player2.health <= 0) {
            determineWinner({player, player2, timerId});
        }
    }
}

// eventhandlers for the controls
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // player 1
        case 'd':
           keys.d.pressed = true;
           player.lastkey = 'd';
        break;

        case 'a':
            keys.a.pressed = true;
            player.lastkey = 'a';
        break;

        case 'w':
             // value based on collision check in classes.js
            if (player.position.y + player.height + player.velocity.y >= canvas.height - 96) {
                player.velocity.y = -16 
            }
        break;

        case ' ':
           player.attack();
        break;
        // player2
        case 'ArrowLeft':
           keys.ArrowLeft.pressed = true;
           player2.lastkey = 'ArrowLeft';
        break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            player2.lastkey = 'ArrowRight';
        break;
        
        case 'ArrowUp':
            // value based on collision check in classes.js
            if (player2.position.y + player2.height + player2.velocity.y >= canvas.height - 96) {
                player2.velocity.y = -16
            }
         break;

        case 'ArrowDown':
            player2.attack();
         break;

        //  restart game
        case 'Enter': 
            restartGame();
        break;
    }
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // player 1
        case 'd':
            keys.d.pressed = false
        break;

        case 'a':
            keys.a.pressed = false
        break;

        case 'w':
            keys.w.pressed = false
        break;
        // player 2
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
         break;
 
         case 'ArrowRight':
             keys.ArrowRight.pressed = false;
         break;
 
         case 'ArrowUp':
            keys.ArrowUp.pressed = false
         break;
    }
})

// change hitbox of attack when player 'turns' around
function changeHitbox (direction_charachter, what_player) {
    switch (true) {
        case direction_charachter === 'left' && what_player === 1 && player.attackBox.offset.x !== -160:
            player.attackBox.offset.x = -160;
            return player.attackBox.offset.x;
        break;

        case direction_charachter === 'right' && what_player === 1 && player.attackBox.offset.x !== 100:
            player.attackBox.offset.x = 100;
            return player.attackBox.offset.x;
        break;

        case direction_charachter === 'left' && what_player === 2 && player2.attackBox.offset.x !== -160:
            player2.attackBox.offset.x = -160;
            return player2.attackBox.offset.x
        break;

        case direction_charachter === 'right' && what_player === 2 && player2.attackBox.offset.x !== 100:
            player2.attackBox.offset.x = 100;
            return player2.attackBox.offset.x
        break;
    }
}

function increaseWin () {
    if (player2.health === 0 && gameover === true && increasedWin === false) {
        console.log('komt in functie');
        // increase player 1 win count
        let win = document.getElementById('count_player_1').innerHTML;
        win++;
        document.getElementById('count_player_1').innerHTML = win;
        increasedWin = true;
    } else if (player.health === 0 && gameover === true && increasedWin === false) {
        // increase player 2 win count
        let win = document.getElementById('count_player_2').innerHTML;
        win++;
        document.getElementById('count_player_2').innerHTML = win;
        increasedWin = true;
    }
}

// call animation
animate();
// call timer 
decreaseTimer();




