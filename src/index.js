import Game, { GAMESTATE } from "./game.js";

var ctx = main_window.getContext('2d');
var width = main_window.width;
var height = main_window.height;

var game = new Game();

// ------ INPUT CONFIGURATION ------
document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 32:
            game.ball.go();
            break;
    
        case 13:
            game.togglePause();
            game.start();
            break;
    }
});

document.addEventListener("mousemove", event => {
    if (game.gamestate === GAMESTATE.RUNNING){
        game.paddle.pos.x = event.clientX - game.paddle.width/2 - 10;
        if (game.ball.state === 0) {
            game.ball.pos.x = game.paddle.pos.x + game.paddle.width/2;
        }
    }
});

// ------------------------------

function loop() {
    ctx.clearRect(0, 0, width, height);
    game.update();
    game.draw(ctx);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);