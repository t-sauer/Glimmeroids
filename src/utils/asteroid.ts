import { GlimmeroidsState } from '../ui/components/Glimmeroids/component';
import { Entity, Position } from './entity';
import { asteroidVertices, randomNumBetween } from './helper';
import Particle from './Particle';

const FILL_IMAGE = new Image();
FILL_IMAGE.src = 'data:image/png;base64,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';

export default class Asteroid implements Entity {
  position: Position;
  velocity: Position;
  rotation: number;
  rotationSpeed: number;
  radius: number;
  score: number;
  vertices: Position[];
  imageOffset: Position;
  delete: boolean;

  create: Function;
  addScore: Function;

  constructor(args: any) {
    this.position = args.position;
    this.velocity = {
      x: randomNumBetween(-1.5, 1.5),
      y: randomNumBetween(-1.5, 1.5)
    };
    this.rotation = 0;
    this.rotationSpeed = randomNumBetween(-1, 1);
    this.radius = args.size;
    this.score = (80 / this.radius) * 5;
    this.create = args.create;
    this.addScore = args.addScore;
    this.vertices = asteroidVertices(8, args.size);
    this.imageOffset = {
      x: randomNumBetween(-this.radius * 0.3, this.radius * 0.3),
      y: randomNumBetween(-this.radius * 0.3, this.radius * 0.3)
    };
  }

  destroy() {
    this.delete = true;
    this.addScore(this.score);

    // Explode
    for (let i = 0; i < this.radius; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(60, 100),
        size: randomNumBetween(1, 3),
        position: {
          x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
          y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
        }
      });
      this.create(particle, 'particles');
    }

    // Break into smaller asteroids
    if (this.radius > 10) {
      for (let i = 0; i < 2; i++) {
        let asteroid = new Asteroid({

          size: this.radius / 2,
          position: {
            x: randomNumBetween(-10, 20) + this.position.x,
            y: randomNumBetween(-10, 20) + this.position.y
          },
          create: this.create.bind(this),
          addScore: this.addScore.bind(this)
        });
        this.create(asteroid, 'asteroids');
      }
    }
  }

  render(state: GlimmeroidsState) {
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if (this.position.x > state.screen.width + this.radius) {
      this.position.x = -this.radius;
    } else if (this.position.x < -this.radius) {
      this.position.x = state.screen.width + this.radius;
    }
    if (this.position.y > state.screen.height + this.radius) {
      this.position.y = -this.radius;
    } else if (this.position.y < -this.radius) {
      this.position.y = state.screen.height + this.radius;
    }

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#FFF';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -this.radius);
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    context.closePath();
    context.clip();
    context.drawImage(
      FILL_IMAGE,
      -this.radius * 1.5 + this.imageOffset.x,
      -this.radius * 1.5 + this.imageOffset.y,
      this.radius * 3,
      this.radius * 3
    );
    context.stroke();
    context.restore();
  }
}
