import { GlimmeroidsState } from '../ui/components/glimmeroids-app/component';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  position: Position;
  velocity: Position;
  delete: boolean;

  destroy(): void;
  render(state: GlimmeroidsState): void;
}
