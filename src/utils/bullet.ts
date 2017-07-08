import { GlimmeroidsState } from '../ui/components/glimmeroids-app/component';
import { Entity, Position } from './entity';
import { rotatePoint } from './helper';

export default class Bullet implements Entity {
  position: Position;
  velocity: Position;
  rotation: number;
  radius: number;
  delete: boolean;

  constructor(args: any) {
    let posDelta = rotatePoint({x: 0, y: -20}, {x: 0, y: 0}, args.ship.rotation * Math.PI / 180);
    this.position = {
      x: args.ship.position.x + posDelta.x,
      y: args.ship.position.y + posDelta.y
    };
    this.rotation = args.ship.rotation;
    this.velocity = {
      x: posDelta.x / 2 + args.ship.velocity.x * 0.7,
      y: posDelta.y / 2 + args.ship.velocity.y * 0.7,
    };
    this.radius = 2;
  }

  destroy() {
    this.delete = true;
  }

  render(state: GlimmeroidsState) {
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Delete if it goes out of bounds
    if ( this.position.x < 0
      || this.position.y < 0
      || this.position.x > state.screen.width
      || this.position.y > state.screen.height ) {
        this.destroy();
    }

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.fillStyle = '#FFF';
    context.lineWidth = 0.5;
    context.beginPath();
    context.arc(0, 0, 2, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }
}