// collison function
function collisionCheck (
    playerObject1,
    playerObject2
) {
    return(
        playerObject1.attackBox.position.x + playerObject1.attackBox.width >= playerObject2.position.x && 
        playerObject1.attackBox.position.x <= playerObject2.position.x + playerObject2. width &&
        playerObject1.attackBox.position.y + playerObject1.attackBox.height >= playerObject2.position.y &&
        playerObject1.attackBox.position.y <= playerObject2.position.y + playerObject2.height
    )
}

// win condition function
function determineWinner ({player, player2, timerId}) {
    clearTimeout(timerId);
    document.querySelector('#win_message').style.display = 'flex'
    switch (true) {
        case player.health === player2.health:
            document.querySelector('#win_message').innerHTML = "Tie.  " + "<br>" +  " Press enter to restart game!";
        break

        case player.health > player2.health:
            document.querySelector('#win_message').innerHTML = "Player 1 won! " + "<br>" +  "press enter to restart game!"; 
        break

        case player.health < player2.health:
            document.querySelector('#win_message').innerHTML = "Player 2 won!  " + "<br>" +  " press enter to restart game!";
        break
    }
}

// function for timer
function decreaseTimer () {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if (timer === 0) {
        determineWinner({player, player2, timerId});
    }
}

//restart game function
function restartGame() {
    // set all global variables back to what they used to be
    if (gameover){
        timer = 121;
        player.position.x = 0;
        player2.position.x = 950;
        player.position.y = 0;
        player2.position.y - 100;
        player.health = 100
        player2.health = 100;
        document.querySelector('#win_message').innerHTML = '';
        document.querySelector('#player1_current_health').style.width = 100 + "%";
        document.querySelector('#player2_current_health').style.width = 100 + "%";
        player.update();
        player2.update();
    }
    gameover = false;
    increasedWin = false;
    // call timer 
    decreaseTimer();
}

// audio play and stop function
let audio = document.getElementById("audio");
audio.autoplay = true;
function play() { 
return audio.play(); 
};

function stop() {
return audio.pause(); 
};

