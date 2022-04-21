import Game, { GAMESTATE } from "./game.js";
// Pour tester les collisions :
import Position from "./position.js";

var ctx = main_window.getContext('2d');
var width = main_window.width;
var height = main_window.height;

var game = new Game();

// ------ INPUT CONFIGURATION ------
document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 32:
            // game.ball.go();
            // Pour tester les collisions :
            game.ball.speed = new Position(0,-5);
            break;
    
        case 13:
            game.togglePause();
            game.start();
            break;
    }
});

var mouseControl = false;

document.addEventListener("mousemove", event => {
    if (mouseControl) {
        // Pour tester les collisions :
        game.ball.pos.x = event.clientX - game.ball.radius;
        game.ball.pos.y = event.clientY - game.ball.radius;
        game.ball.speed.x = 0.1;
        game.ball.speed.y = 0.1;
    }
    else {
        if (game.gamestate === GAMESTATE.RUNNING) {
            game.paddle.pos.x = event.clientX - game.paddle.width / 2 - 10;
            if (game.ball.state == 0) {
                game.ball.state = 1;
                game.ball.pos.x = game.paddle.pos.x + game.paddle.width / 2;
            }
        }
    }
});

document.addEventListener("mousedown", event => {
    //if (mouseControl) {
    //    game.ball.pos.x = game.paddle.pos.x + game.paddle.width / 2;
    //}

    mouseControl = !mouseControl;
});

// ------------------------------

function loop() {
    ctx.clearRect(0, 0, width, height);
    game.update();
    game.draw(ctx);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);