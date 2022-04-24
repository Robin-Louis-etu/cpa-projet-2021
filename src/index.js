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
        case 32: // touche espace pour lancer la balle
            // game.ball.go();
            // Pour tester les collisions :
            game.balls[0].speed = new Position(0,-5);
            break;

        case 13: // touche entrée pour relancer une partie lorsqu'on a perdu
            game.reset();
            break;

        case 27: // touche echap pour faire pause ou reprendre la partie
            game.togglePause();
            break;
    }
});

document.addEventListener("mousemove", event => {
    // if (game.gamestate === GAMESTATE.RUNNING){
    //     game.paddle.pos.x = event.clientX - game.paddle.width/2 - 10;
    //     if (game.balls[0].state === 0) {
    //         game.balls[0].pos.x = game.paddle.pos.x + game.paddle.width/2;
    //     }
    // }

    // Pour tester les collisions :
    if (game.gamestate === GAMESTATE.RUNNING) {
        game.balls[0].pos.x = event.clientX - (width / 2);
        game.balls[0].pos.y = event.clientY - game.balls[0].radius;
        game.balls[0].speed.x = 0.000001;
        game.balls[0].speed.y = 0.000001;
    }
});

// ------------------------------

game.start();

function loop() {
    ctx.clearRect(0, 0, width, height);
    game.update();
    game.draw(ctx);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);