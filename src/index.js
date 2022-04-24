import Game, { GAMESTATE } from "./game.js";

var ctx = main_window.getContext('2d');
var width = main_window.width;
var height = main_window.height;

var game = new Game();

// ------ INPUT CONFIGURATION ------
document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 32: // touche espace pour lancer la balle
            game.balls[0].go();
            break;

        case 13: // touche entrée pour relancer une partie lorsqu'on a perdu
            game.reset();
            break;

        case 27: // touche echap pour faire pause ou reprendre la partie
            game.togglePause();
            break;
    }
});

var mouseControl = false;

document.addEventListener("mousemove", event => {
    if (mouseControl) {
        if (game.gamestate === GAMESTATE.RUNNING) {
            // Pour tester les collisions :
            game.balls[0].pos.x = event.clientX - game.balls[0].radius;
            game.balls[0].pos.y = event.clientY - game.balls[0].radius;
            game.balls[0].speed.x = 5;
            game.balls[0].speed.y = 0;
        }
    }
    else {
        if (game.gamestate === GAMESTATE.RUNNING) {
            var relativeX = event.clientX - main_window.offsetLeft;
            if (relativeX > 0 && relativeX < width) {
                game.paddle.pos.x = relativeX - game.paddle.width / 2;
                if (game.paddle.pos.x < 0) {
                    game.paddle.pos.x = 0;
                } else if (game.paddle.pos.x + game.paddle.width > width) {
                    game.paddle.pos.x = width - game.paddle.width;
                }
                if (game.balls[0].state === 0) {
                    game.balls[0].pos.x = game.paddle.pos.x + game.paddle.width / 2;
                    console.log(`Balle : x = ${game.balls[0].pos.x} y : ${game.balls[0].pos.y}`);
                    console.log(`Paddle : x = ${game.paddle.pos.x} y = ${game.paddle.pos.y}`);
                }
            }
        }
    }
});

document.addEventListener("mousedown", () => {
    mouseControl = !mouseControl;
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