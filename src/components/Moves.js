import { Container, Sprite, filters } from 'pixi.js';
import Symbol from './Symbol';

export default class Moves extends Container {
  constructor() {
    super();

    this.decimalValueMoves = '2';
    this.singleValueMove = '0';

    this.init();
  }

  async init() {
    await this.addBackgrond();
    await this.addText();
    await this.addMovesDigits();
  }

  addBackgrond() {
    const movesBackground = new Sprite.from('movesBackground');
    movesBackground.anchor.set(0.5);

    this.addChild(movesBackground);
  }

  addText() {
    const movesText = new Symbol('movesText', 1, 'bw');
    movesText.anchor.set(0.5);
    movesText.x = - 45;
    movesText.y = - 40;
    this.addChild(movesText);
  }

  addMovesDigits() {
    const decimalDigit = new Symbol(this.decimalValueMoves, 0.8, 'bw');
    const singleDigit = new Symbol(this.singleValueMove, 0.8, 'bw');

    this.decimalDigit = decimalDigit;
    this.decimalDigit.anchor.set(0.5);
    this.decimalDigit.x = - 50;
    this.decimalDigit.y = - 30;

    this.addChild(this.decimalDigit);

    this.singleDigit = singleDigit;
    this.singleDigit.anchor.set(0.5);
    this.singleDigit.x = - 8;
    this.singleDigit.y = - 30;

    this.addChild(this.singleDigit);
  }

  changeMoves(value) {
    const currentMovesElements = value.toString().split('');

    if (currentMovesElements.length === 2) {
      this.decimalDigit.setSymbol(currentMovesElements[0]);
      this.singleDigit.setSymbol(currentMovesElements[1]);
    } else if (currentMovesElements.length === 1) {
      this.decimalDigit.setSymbol('0');
      this.singleDigit.setSymbol(currentMovesElements[0]);
    }
  }
}