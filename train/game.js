
const config = {
    type: Phaser.AUTO,
    backgroundColor: 0xA0522D,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let train;
let cargo1;
let cargo2;
let path;
let follower;
let trainTween;
let trafficLight;
let trafficLightState = 'green';
let trainSound;
const speed = 0.001;
const historySize = 200;
let history = [];

function preload ()
{
    this.load.audio('train_sound', 'train_sound.mp3');
}

function create ()
{
    const graphics = this.add.graphics();

    // Draw the triple-railed track with ties
    graphics.lineStyle(2, 0x808080, 1);
    const outerRadiusX = 200;
    const outerRadiusY = 150;
    const middleRadiusX = 190;
    const middleRadiusY = 140;
    const innerRadiusX = 180;
    const innerRadiusY = 130;

    const outerEllipse = new Phaser.Curves.Ellipse(400, 300, outerRadiusX, outerRadiusY);
    const middleEllipse = new Phaser.Curves.Ellipse(400, 300, middleRadiusX, middleRadiusY);
    const innerEllipse = new Phaser.Curves.Ellipse(400, 300, innerRadiusX, innerRadiusY);

    outerEllipse.draw(graphics);

    graphics.lineStyle(2, 0xA0522D, 1); // Brown for middle track
    middleEllipse.draw(graphics);
    graphics.lineStyle(2, 0x808080, 1); // Grey for other tracks and ties

    innerEllipse.draw(graphics);

    // Draw the ties
    for (let i = 0; i < 1; i += 0.02) {
        const outerPoint = outerEllipse.getPoint(i);
        const innerPoint = innerEllipse.getPoint(i);
        graphics.lineBetween(outerPoint.x, outerPoint.y, innerPoint.x, innerPoint.y);
    }

    path = middleEllipse; // Train follows the middle track

    trainSound = this.sound.add('train_sound', { loop: true });

    const startText = this.add.text(300, 280, 'Click to Start', { fontSize: '32px', fill: '#fff' });

    this.input.once('pointerdown', () => {
        trainSound.play();
        startText.destroy();
    });

    // Draw trees with random positions that don't overlap
    const treePositions = [];
    const minDistance = 50;
    const maxAttempts = 100; // To prevent infinite loops

    for (let i = 0; i < 3; i++) {
        let attempts = 0;
        let newPos;
        let validPosition = false;

        while (!validPosition && attempts < maxAttempts) {
            newPos = {
                x: Phaser.Math.Between(300, 500),
                y: Phaser.Math.Between(250, 350)
            };

            let overlaps = false;
            for (const pos of treePositions) {
                const distance = Phaser.Math.Distance.Between(newPos.x, newPos.y, pos.x, pos.y);
                if (distance < minDistance) {
                    overlaps = true;
                    break;
                }
            }

            if (!overlaps) {
                validPosition = true;
            }
            attempts++;
        }

        if (validPosition) {
            treePositions.push(newPos);

            // Trunk
            graphics.fillStyle(0x8B4513, 1); // Brown
            graphics.fillRect(newPos.x - 5, newPos.y + 30, 10, 20);

            // Foliage
            graphics.fillStyle(0x228B22, 1); // Green
            graphics.fillTriangle(newPos.x, newPos.y, newPos.x - 20, newPos.y + 40, newPos.x + 20, newPos.y + 40);
        }
    }

    // Create the train and cargo
    train = this.add.rectangle(0, 0, 30, 15, 0xff0000);
    cargo1 = this.add.rectangle(0, 0, 25, 15, 0x00ff00);
    cargo2 = this.add.rectangle(0, 0, 25, 15, 0x0000ff);

    // Traffic light
    trafficLight = this.add.graphics();
    trafficLight.x = 620;
    trafficLight.y = 250;
    trafficLight.fillStyle(0x333333, 1);
    trafficLight.fillRect(0, 0, 30, 60);

    // Timer for traffic light
    this.time.addEvent({
        delay: 8000, // green light duration
        callback: () => {
            trafficLightState = 'red';
            this.time.delayedCall(2000, () => { // red light duration
                trafficLightState = 'green';
            });
        },
        loop: true
    });

    // Follower for the train
    follower = { t: 0, vec: new Phaser.Math.Vector2() };
    trainTween = this.tweens.add({
        targets: follower,
        t: 1,
        ease: 'Linear',
        duration: 10000,
        repeat: -1,
        yoyo: false
    });
}

function update ()
{
    // Update traffic light colors
    trafficLight.clear();
    trafficLight.fillStyle(0x333333, 1);
    trafficLight.fillRect(0, 0, 30, 60);
    if (trafficLightState === 'red') {
        trafficLight.fillStyle(0xff0000, 1);
        trafficLight.fillCircle(15, 15, 10);
    } else {
        trafficLight.fillStyle(0x00ff00, 1);
        trafficLight.fillCircle(15, 45, 10);
    }

    // Stop train at red light
    const stopZone = (follower.t > 0.98 || follower.t < 0.02);
    if (trafficLightState === 'red' && stopZone) {
        trainTween.pause();
        if (trainSound) trainSound.pause();
    } else {
        trainTween.resume();
        if (trainSound) trainSound.resume();
    }

    // Get the new position on the path
    path.getPoint(follower.t, follower.vec);

    // Update the train's position and rotation
    train.setPosition(follower.vec.x, follower.vec.y);
    const tangent = path.getTangent(follower.t);
    train.setRotation(tangent.angle());

    // Add the current position to the history only when the train is moving
    if (trainTween.isPlaying()) {
        history.push({ x: follower.vec.x, y: follower.vec.y, angle: tangent.angle() });
        if (history.length > historySize) {
            history.shift();
        }
    }

    // Update cargo positions
    if (history.length > 30) {
        const pos1 = history[history.length - 30];
        cargo1.setPosition(pos1.x, pos1.y);
        cargo1.setRotation(pos1.angle);
    }

    if (history.length > 60) {
        const pos2 = history[history.length - 60];
        cargo2.setPosition(pos2.x, pos2.y);
        cargo2.setRotation(pos2.angle);
    }
}
