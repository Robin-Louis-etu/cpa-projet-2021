import Game, { GAMESTATE } from "./game.js";

var ctx = main_window.getContext('2d');
var width = main_window.width;
var height = main_window.height;

// ------ GAME CONFIGURATION ------

var game = new Game();

// --- Inputs ---
document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 32:
            console.log(game.gamestate);
            game.ball.go();
            break;
    
        case 13:
            game.togglePause();
            game.start();
            break;
    }
})
document.addEventListener("mousemove", event => {
    if (game.gamestate === GAMESTATE.RUNNING){
        game.paddle.pos.x = event.clientX - game.paddle.width/2 - 10;
        game.ball.pos.x = game.paddle.pos.x + game.paddle.width/2;
    }
})

// ------------------------------

function loop() {
    ctx.clearRect(0, 0, width, height);
    game.update();
    game.draw(ctx);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);