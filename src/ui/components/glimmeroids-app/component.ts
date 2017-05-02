import Component, { tracked } from '@glimmer/component';
import Asteroid from '../../../utils/asteroid';
import Bullet from '../../../utils/bullet';
import { Entity } from '../../../utils/entity';
import { randomNumBetweenExcluding } from '../../../utils/helper';
import Particle from '../../../utils/Particle';
import Ship from '../../../utils/ship';

const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32
};

export interface GlimmeroidsState {
  screen: {
    width: number,
    height: number,
    ratio: number
  };
  context: CanvasRenderingContext2D;
  keys: {
    left: Boolean,
    right: Boolean,
    up: Boolean,
    down: Boolean,
    space: Boolean
  };
  asteroidCount: number;
  currentScore: number;
  topScore: number;
  inGame: boolean;
}

export default class Glimmeroids extends Component {
  @tracked state: GlimmeroidsState;
  ship: Ship[];
  asteroids: Asteroid[];
  bullets: Bullet[];
  particles: Particle[];

  constructor(options: object) {
    super(options);
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys : {
        left  : false,
        right : false,
        up    : false,
        down  : false,
        space : false
      },
      asteroidCount: 3,
      currentScore: 0,
      topScore: localStorage.topscore || 0,
      inGame: true
    };
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
  }

  @tracked('state')
  get gameOverMessage() {
    if (this.state.currentScore <= 0) {
      return '0 points... So sad.';
    } else if (this.state.currentScore >= this.state.topScore) {
      return 'Top score with ' + this.state.currentScore + ' points. Woo!';
    } else {
      return this.state.currentScore + ' Points though :)';
    }
  }

  @tracked('state')
  get canvasSize() {
    return {
      width: this.state.screen.width * this.state.screen.ratio,
      height: this.state.screen.height * this.state.screen.ratio
    };
  }

  handleResize() {
    this.state = {
      ...this.state,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    };
  }

  handleKeyUp(event: KeyboardEvent) {
    this.handleKeys(false, event);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.handleKeys(true, event);
  }

  handleKeys(value: Boolean, event: KeyboardEvent) {
    let keys = this.state.keys;
    if (event.keyCode === KEY.LEFT   || event.keyCode === KEY.A) { keys.left  = value; }
    if (event.keyCode === KEY.RIGHT  || event.keyCode === KEY.D) { keys.right = value; }
    if (event.keyCode === KEY.UP     || event.keyCode === KEY.W) { keys.up    = value; }
    if (event.keyCode === KEY.SPACE) { keys.space = value; }

    this.state = {
      ...this.state,
      keys
    };
  }

  didInsertElement() {
    window.addEventListener('keyup',   this.handleKeyUp.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('resize',  this.handleResize.bind(this));

    const context = (this.element as HTMLElement).querySelector('canvas').getContext('2d');
    this.state = {
      ...this.state,
      context
    };
    this.startGame();
    requestAnimationFrame(() => this.update());
  }

  willDestroy() {
    window.removeEventListener('resize', this.handleKeyUp);
    window.removeEventListener('resize', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Next set of asteroids
    if (!this.asteroids.length) {
      let count = this.state.asteroidCount + 1;

      this.state = {
        ...this.state,
        asteroidCount: count
      };
      this.generateAsteroids(count);
    }

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWith(this.ship, this.asteroids);

    // Remove or render
    this.updateObjects(this.particles, 'particles');
    this.updateObjects(this.asteroids, 'asteroids');
    this.updateObjects(this.bullets, 'bullets');
    this.updateObjects(this.ship, 'ship');

    context.restore();

    // Next frame
    requestAnimationFrame(() => this.update());
  }

  addScore(points: number) {
    if (this.state.inGame) {
      this.state = {
        ...this.state,
        currentScore: this.state.currentScore + points
      };
    }
  }

  startGame() {
    this.state = {
      ...this.state,
      inGame: true,
      currentScore: 0
    };

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this)
    });
    this.createObject(ship, 'ship');

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount);
  }

  gameOver() {
    this.state = {
      ...this.state,
      inGame: false
    };

    // Replace top score
    if (this.state.currentScore > this.state.topScore) {
      this.state = {
        ...this.state,
        topScore: this.state.currentScore
      };
      localStorage.setItem('topscore', String(this.state.currentScore));
    }
  }

  generateAsteroids(amount: number) {
    let ship = this.ship[0];
    for (let i = 0; i < amount; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x - 60, ship.position.x + 60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y - 60, ship.position.y + 60)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this)
      });
      this.createObject(asteroid, 'asteroids');
    }
  }

  createObject(item: Entity, group: 'asteroids' | 'ship' | 'particles' | 'bullets') {
    if (group === 'asteroids') {
      this.asteroids.push(item as Asteroid);
    } else if (group === 'ship') {
      this.ship.push(item as Ship);
    } else if (group === 'particles') {
      this.particles.push(item as Particle);
    } else if (group === 'bullets') {
      this.bullets.push(item as Bullet);
    }
  }

  updateObjects(items: Entity[], group: 'asteroids' | 'ship' | 'particles' | 'bullets') {
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1: Entity[], items2: Entity[]) {
    for (let a = 0; a < items1.length; a++) {
      let item1 = items1[a];
      for (let b = 0; b < items2.length; b++) {
        let item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollision(obj1: Entity, obj2: Entity): boolean {
    let vx = obj1.position.x - obj2.position.x;
    let vy = obj1.position.y - obj2.position.y;
    let length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }
}
