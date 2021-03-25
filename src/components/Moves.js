import { Container, Sprite } from 'pixi.js';
import Symbol from './Symbol';

export default class Moves extends Container {
  constructor() {
    super();

    this.decimalValueMoves = '2';
    this.singleValueMove = '0';

    this.init();
  }

  /**
   * Initizlies the Moves panel
   * 
   * @method
   * @memberof Moves
   */
  async init() {
    await this._addBackgrond();
    await this._addText();
    await this._addMovesDigits();
  }

  /**
   * Adds the background element of the Move panel
   * 
   * @private
   * @method
   * @memberof Moves
   */
  _addBackgrond() {
    const movesBackground = new Sprite.from('movesBackground');
    movesBackground.anchor.set(0.5);

    this.addChild(movesBackground);
  }

  /**
   * Adds the "MOVES" text of the Move panel
   * 
   * @private
   * @method
   * @memberof Moves
   */
  _addText() {
    const movesText = new Symbol('movesText', 1, 'bw');
    movesText.anchor.set(0.5);
    movesText.x = - 45;
    movesText.y = - 40;
    this.addChild(movesText);
  }

  /**
   * Adds the digits in the Move panel
   * 
   * @private
   * @method
   * @memberof Moves
   */
  _addMovesDigits() {
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

  /**
   * Changes the value of the remaining moves 
   * 
   * @method
   * @param {Number} value
   * @memberof Moves
   */
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