import { GlimmeroidsState } from '../ui/components/Glimmeroids/component';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  position: Position;
  velocity: Position;
  delete: boolean;
  radius: number;

  destroy(): void;
  render(state: GlimmeroidsState): void;
}
