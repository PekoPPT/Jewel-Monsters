import { Container, Graphics, Text, AnimatedSprite, BLEND_MODES, Sprite } from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);
export default class Fire extends Sprite {
  constructor() {
    super();
    this.init();
  }

  init() {
    this._fire = new Sprite.from('fire');
    // this._fire.y = 41;
    this._fire.anchor.set(0.5);
    this.addChild(this._fire);
  }
}