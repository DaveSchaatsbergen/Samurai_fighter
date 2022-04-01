// create class for generating sprite properties
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, frameCurrent = 0, framesElapsed = 0, framesHold = 1, offset = {x:0 , y:0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150; 
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.frameCurrent = frameCurrent;
        this.framesElapsed = framesElapsed;
        this.framesHold = framesHold;
        this.offset = offset  
    }

    draw() {
       context_view.drawImage(
        this.image,
        this.frameCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y, 
        (this.image.width / this.framesMax) * this.scale, 
        this.image.height * this.scale
        )
    }

    // animate sprite function
    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0){
            // substract 1 from framesmax for static sprites
            if (this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update() {
        // drawing sprite frame for frame
        this.draw();
        this.animateFrames();
    }
}


// class for player properties
class Fighter extends Sprite {
    constructor({position, velocity, playerColor = 'red', imageSrc, scale = 1, framesMax = 1, frameCurrent = 0, framesElapsed = 0, framesHold = 1, offset = {x:0 , y:0}, sprites, hitBox = {hitBoxOffset: {}, width: undefined, height:undefined}}) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            frameCurrent,
            framesElapsed,
            framesHold,
            offset
        })
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastkey;
        this.playerColor = playerColor;
        this.isAttacking;
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x ,
                y: this.position.y
            } ,
            offset: hitBox.hitBoxOffset,
            width: hitBox.width ,
            height: hitBox.height,
        }
        this.sprites = sprites;
        // loop through sprites
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src =  sprites[sprite].imageSrc;
        }   
    }

   

    update() {

        // hitboxes
        this.draw();
        this.animateFrames();
    
        // attackbox
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // giving collison with bottom of canvas
        if (this.position.y + this.height + this.velocity.y >= (canvas.height - 96)) {
            this.velocity.y = 0; 
        } else {
            this.velocity.y += gravity;
        }
    }
    // attacks
    attack() {
        this.switchSprite('attack');
        this.isAttacking = true;
    }

    // player 1 or 2 takes hit
    takeHit() {
        // player 1 or 2 takes 5 damage
        this.health -= 5;
        this.switchSprite('takeHit');
        if (this.health === 0) {
            gameover = true;
            increaseWin();
        }
    }

    // function for switching between sprites framerates based on action of player
    switchSprite (sprite) {
        // overrides all animations when attacking
        if (this.image === this.sprites.attack.image && this.frameCurrent < this.sprites.attack.framesMax -1) {
            return;
        }

        // overrides all animations when hit
        if (this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax -1) {
            return;
        }

        switch (sprite) {
            case 'idle_left':
                if (this.image !== this.sprites.idle_left.image) {
                    this.image = this.sprites.idle_left.image;
                    this.framesMax = this.sprites.idle_left.framesMax;
                    this.frameCurrent = 0;
                }
            break;

            case 'idle_right':
                if (this.image !== this.sprites.idle_right.image) {
                    this.image = this.sprites.idle_right.image;
                    this.framesMax = this.sprites.idle_right.framesMax;
                    this.frameCurrent = 0;
                }
            break;

            case 'run_left':
                if (this.image !== this.sprites.run_left.image) {
                    this.image = this.sprites.run_left.image;
                    this.framesMax = this.sprites.run_left.framesMax;
                    this.frameCurrent = 0;
                }
            break;

            case 'run_right':
                if (this.image !== this.sprites.run_right.image) {
                    this.image = this.sprites.run_right.image;
                    this.framesMax = this.sprites.run_right.framesMax;
                    this.frameCurrent = 0;
                }
            break;

            case 'attack':
                if (this.image !== this.sprites.attack.image) {
                    if (this.image.src.includes('/player2/')) {
                        // mean it's player 2 requesting animation
                        if (this.image.src.includes('/img/character/player2/Run_right.png') || this.image.src.includes("/img/character/player2/Idle_right.png")) {
                            this.sprites.attack.image.src =  "./img/character/player2/Attack_right.png";
                            this.image = this.sprites.attack.image;
                            this.framesMax = this.sprites.attack.framesMax;
                            this.frameCurrent = 0;
                        } else {
                            this.sprites.attack.image.src =  "./img/character/player2/Attack_left.png";
                            this.image = this.sprites.attack.image;
                            this.framesMax = this.sprites.attack.framesMax;
                            this.frameCurrent = 0;
                        }
                    }
                    else {
                        // means player 1 is requesting animation
                        if (this.image.src.includes('/img/character/player1/Run_right.png') || this.image.src.includes("/img/character/player1/Idle_right.png")) {
                            this.sprites.attack.image.src =  "./img/character/player1/Attack_right.png";
                            this.image = this.sprites.attack.image;
                            this.framesMax = this.sprites.attack.framesMax;
                            this.frameCurrent = 0;
                        } else {
                            this.sprites.attack.image.src =  "./img/character/player1/Attack_left.png";
                            this.image = this.sprites.attack.image;
                            this.framesMax = this.sprites.attack.framesMax;
                            this.frameCurrent = 0;
                        }
                    }
                }
            break;

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    if (this.image.src.includes('/player2/')) {
                        // mean it's player 2 requesting animation
                        if (this.image.src.includes('/img/character/player2/Run_right.png') || this.image.src.includes("/img/character/player2/Idle_right.png")) {
                            this.sprites.takeHit.image.src =  "./img/character/player2/Hit_right.png";
                            this.image = this.sprites.takeHit.image;
                            this.framesMax = this.sprites.takeHit.framesMax;
                            this.frameCurrent = 0;
                        } else {
                            this.sprites.takeHit.image.src =  "./img/character/player2/Hit_left.png";
                            this.image = this.sprites.takeHit.image;
                            this.framesMax = this.sprites.takeHit.framesMax;
                            this.frameCurrent = 0;
                        }
                    }
                    else {
                        // means player 1 is requesting animation
                        if (this.image.src.includes('/img/character/player1/Run_right.png') || this.image.src.includes("/img/character/player1/Idle_right.png")) {
                            this.sprites.takeHit.image.src =  "./img/character/player1/Hit_right.png";
                            this.image = this.sprites.takeHit.image;
                            this.framesMax = this.sprites.takeHit.framesMax;
                            this.frameCurrent = 0;
                        } else {
                            this.sprites.takeHit.image.src =  "./img/character/player1/Hit_left.png";
                            this.image = this.sprites.takeHit.image;
                            this.framesMax = this.sprites.takeHit.framesMax;
                            this.frameCurrent = 0;
                        }
                    }
                }
            break;
        }
    }
}


