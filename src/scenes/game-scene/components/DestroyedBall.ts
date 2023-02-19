import { TextureKeys } from 'types/enums';
import { GAME_SCENE } from 'const/scenes/GameSceneConsts';
import { Scene } from 'phaser';

export default class DestroyedBall {
  public create(scene: Scene, x: number, y: number): void {
    const emitterConfig = {
      ...GAME_SCENE.fireworks,
      rotate: { onEmit: this.updateParticleRotation, onUpdate: this.updateParticleRotation },
      scaleX: {
        onUpdate: (
          particle: Phaser.GameObjects.Particles.Particle,
        ) => Phaser.Math.Easing.Cubic.Out(1 - particle.lifeT),
      },
    };

    const particles = scene.add.particles(TextureKeys.MiniBall);

    const emitter1 = particles.createEmitter(emitterConfig).setFrequency(3000);

    emitter1.explode(20, x * Phaser.Math.FloatBetween(0.95, 1.05), y - 100);
  }

  private updateParticleRotation(p: Phaser.GameObjects.Particles.Particle): number {
    return Phaser.Math.RadToDeg(Math.atan2(p.velocityY, p.velocityX));
  }
}
