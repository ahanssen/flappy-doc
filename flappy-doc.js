const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
    sourceX: 390,
    sourceY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        context.fillStyle = '#70c5ce';
        context.fillRect(0,0, canvas.width, canvas.height);

        context.drawImage(
          sprites,
          background.sourceX, background.sourceY,
          background.width, background.height,
          background.x, background.y,
          background.width,background.height,  
        );

        context.drawImage(
            sprites,
            background.sourceX, background.sourceY,
            background.width, background.height,
            background.x + background.width, background.y,
            background.width,background.height,  
          );
    },
}

const flappyDoc = {
    sourceX: 0,
    sourceY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    speed: 0,
    draw() {
        context.drawImage(
            sprites,
            flappyDoc.sourceX,flappyDoc.sourceY,
            flappyDoc.width,flappyDoc.height,
            flappyDoc.x,flappyDoc.y,
            flappyDoc.width,flappyDoc.height,
        );
    },
    refresh() {
        flappyDoc.speed = flappyDoc.speed + flappyDoc.gravity;
        flappyDoc.y = flappyDoc.y + flappyDoc.speed;
    },
};

const getReady = {
    sourceX: 134,
    sourceY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - (174 / 2),
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            getReady.sourceX, getReady.sourceY,
            getReady.width, getReady.height,
            getReady.x, getReady.y,
            getReady.width,getReady.height
        );
    }
}

const ground = {
    sourceX: 0,
    sourceY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw() {
        context.drawImage(
            sprites,
            ground.sourceX, ground.sourceY,
            ground.width, ground.height,
            ground.x,ground.y,
            ground.width,ground.height,
        );

        context.drawImage(
            sprites,
            ground.sourceX, ground.sourceY,
            ground.width, ground.height,
            ground.x + ground.width, ground.y,
            ground.width, ground.height,
        );
    },
}

let activeScreen = {}

function setActiveScreen(screen) {
    activeScreen = screen;
}

const Screens = {
    start: {
        click() {
          setActiveScreen(Screens.game);  
        },
        draw() {
            background.draw();
            ground.draw();
            flappyDoc.draw();
            getReady.draw();
        },
        refresh() {

        }
    }
}

Screens.game = {
    draw() {
        background.draw();
        ground.draw();
        flappyDoc.draw();
    },
    refresh() {
        flappyDoc.refresh();
    }
}

function loop() {
    activeScreen.draw();
    activeScreen.refresh();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(activeScreen.click) {
        activeScreen.click();
    }
});

setActiveScreen(Screens.start);
loop();