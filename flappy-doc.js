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

const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw() {
        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY,
            ground.width, ground.height,
            ground.x,ground.y,
            ground.width,ground.height,
        );

        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY,
            ground.width, ground.height,
            ground.x + ground.width, ground.y,
            ground.width, ground.height,
        );
    },
}

function loop() {
    background.draw();
    ground.draw();
    flappyDoc.refresh();
    flappyDoc.draw();
    

    requestAnimationFrame(loop);
}

loop();