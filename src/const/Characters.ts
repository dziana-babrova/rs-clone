import { CharacterSettings } from "types/types";

export const characters: CharacterSettings[] = [
  {
    texture: 'player1',
    basicFrame: 'player1/prepare/1.png',
    scale: 0.8,
    correction: 10,
    animations: {
      prepare: {
        name: 'player1-prepare',
        prefix: 'player1/prepare/',
        postfix: '.png',
        start: 1,
        end: 9,
        zeroPad: 0,
        frameRate: 24,
      },
      hit: {
        name: 'player1-hit',
        prefix: 'player1/hit/',
        postfix: '.png',
        start: 1,
        end: 8,
        zeroPad: 0,
        frameRate: 24,
      },
      back: {
        name: 'player1-back',
        prefix: 'player1/back/',
        postfix: '.png',
        start: 1,
        end: 6,
        zeroPad: 0,
        frameRate: 24,
      },
    },
  },
  {
    texture: 'player2',
    basicFrame: 'player2/prepare/1.png',
    scale: 0.8,
    correction: 20,
    animations: {
      prepare: {
        name: 'player2-prepare',
        prefix: 'player2/prepare/',
        postfix: '.png',
        start: 1,
        end: 11,
        zeroPad: 0,
        frameRate: 24,
      },
      hit: {
        name: 'player2-hit',
        prefix: 'player2/hit/',
        postfix: '.png',
        start: 1,
        end: 6,
        zeroPad: 0,
        frameRate: 24,
      },
      back: {
        name: 'player2-back',
        prefix: 'player2/back/',
        postfix: '.png',
        start: 1,
        end: 2,
        zeroPad: 0,
        frameRate: 12,
      },
    },
  },
];
