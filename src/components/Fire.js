import { Container, Graphics, Text, AnimatedSprite, BLEND_MODES, Sprite } from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);
export default class Fire extends Sprite {
  constructor() {
    super();
    this.init();
  }

  /**
   * Initializes the Fire displayed next to the play board
   *
   * @method
   * @private
   * @memberof Fire
   */
  async init() {
    this._fire = new Sprite.from('fire');
    this._fire.anchor.set(0.5);

    this._fireGlow = new Sprite.from('fireGlow');
    this._fireGlow.anchor.set(0.5);
    this._fireGlow.y = 50;
    this.addChild(this._fire);
    this.addChild(this._fireGlow);
  }
}