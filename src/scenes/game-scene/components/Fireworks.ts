import { ColorsNumber } from 'const/Colors';
import GAME_SCENE from 'const/GameSceneConsts';
import TextureKeys from 'const/TextureKeys';
import { Scene } from 'phaser';

export default class Fireworks {
  tints: number[] = [
    ColorsNumber.FireworksRed,
    ColorsNumber.FireworksBrightBlue,
    ColorsNumber.FireworksGreen,
    ColorsNumber.FireworksYellow,
    ColorsNumber.FireworksPurple,
  ];

  public create(scene: Scene, x: number, y: number): void {
    const emitterConfig = {
      ...GAME_SCENE.fireworks,
      rotate: { onEmit: this.updateParticleRotation, onUpdate: this.updateParticleRotation },
      scaleX: {
        onUpdate: (
          p: Phaser.GameObjects.Particles.Particle,
        ) => Phaser.Math.Easing.Cubic.Out(1 - p.lifeT),
      },
    };

    const particles = scene.add.particles(TextureKeys.Fireworks);

    const emitter1 = particles.createEmitter(emitterConfig).setFrequency(3000);
    const emitter2 = particles.createEmitter(emitterConfig).setFrequency(4000);
    const emitter3 = particles.createEmitter(emitterConfig).setFrequency(5000);

    this.updateEmitter(emitter1, x * Phaser.Math.FloatBetween(0.95, 1.05), y - 100);
    this.updateEmitter(emitter2, x * Phaser.Math.FloatBetween(0.95, 1.05), y - 50);
    this.updateEmitter(emitter3, x * Phaser.Math.FloatBetween(0.95, 1.05), y);

    emitter1.explode(20, x * Phaser.Math.FloatBetween(0.95, 1.05), y - 100);
    emitter2.explode(20, x * Phaser.Math.FloatBetween(0.95, 1.05), y - 50);
    emitter3.explode(20, x * Phaser.Math.FloatBetween(0.95, 1.05), y);
  }

  private updateEmitter(
    emitter: Phaser.GameObjects.Particles.ParticleEmitter,
    x: number,
    y: number,
  ): void {
    emitter.setPosition(x, y).setTint(Phaser.Utils.Array.GetRandom(this.tints));
  }

  private updateParticleRotation(p: Phaser.GameObjects.Particles.Particle): number {
    return Phaser.Math.RadToDeg(Math.atan2(p.velocityY, p.velocityX));
  }
}
