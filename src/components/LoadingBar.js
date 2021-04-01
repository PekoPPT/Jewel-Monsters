import Assets from '../core/AssetManager';
import { Container, Sprite, Graphics } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import Character from '../components/Character';

import PixiPlugin from 'gsap/PixiPlugin';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

export default class LoadingBar extends Container {

  constructor({ value = 0 } = {}) {
    super();

    this._value = value;
    this._background = null;
    this._rad = Math.PI / 180;
    this.init().then(() => {
      this.set({ value });
    });

  }

  /**
   * Sets the value of the _value parameter
   * 
   * @method
   * @param {Number} { value } - The percentage value of the loading progress
   * @memberof LoadingBar
   */
  set({ value }) {
    this._value = (value - 50) * 2;
    if (this._tl !== undefined) {
      this._tl.progress(this._value / 100);
    }
    if (this._graphicsLeftCircle.angle < 360) {
      this._graphicsLeftCircle.angle = 180 + 360 * this._value / 100;
    } else if (this._graphicsRightCircle.angle < 170) {
      this._graphicsLeftCircle.angle = 360;
      this._graphicsRightCircle.angle = (360 * this._value / 100) / 2;
    } else {
      this._graphicsLeftCircle.angle = 360;
      this._graphicsRightCircle.angle = 180;
    }
  }


  /**
   * Initizlies the Loading bar and the mosnter inside it
   * 
   * @method
   * @memberof LoadingBar
   */
  async init() {

    const graphicsLeftCircle = new Graphics();
    this._graphicsLeftCircle = graphicsLeftCircle;

    this._graphicsLeftCircle.beginFill(0x2698bc);
    this._graphicsLeftCircle.arc(0, 0, 200, 90 * this._rad, 270 * this._rad);
    this._graphicsLeftCircle.angle = 180;

    const graphicsRightCircle = new Graphics();
    this._graphicsRightCircle = graphicsRightCircle;

    this._graphicsRightCircle.beginFill(0x2698bc);
    this._graphicsRightCircle.arc(0, 0, 200, 90 * this._rad, 270 * this._rad);
    this._graphicsRightCircle.x = -3;
    this._graphicsRightCircle.angle = 0;

    const images = {
      loadingBar: Assets.images['loading-bar'],
      loadingBarMaskRight: Assets.images['loading-bar-mask-right'],
      loadingBarMaskLeft: Assets.images['loading-bar-mask-left'],
      loadingBarGlow: Assets.images['loading-bar-glow'],
    };

    const monster = new Character();

    monster.x = -105;
    monster.y = -100;
    monster.scale.set(0.75);

    this.addChild(monster);

    await Assets.load({ images });
    await Assets.prepareImages(images);
    const background = Sprite.from('loadingBar');
    const loadingBarMaskLeft = Sprite.from('loadingBarMaskLeft');
    const loadingBarMaskRight = Sprite.from('loadingBarMaskRight');

    this._background = background;
    this._background.anchor.set(0.5);
    this._background.name = 'background';

    this._loadingBarMaskLeft = loadingBarMaskLeft;
    this._loadingBarMaskLeft.anchor.set(0.5);
    this._loadingBarMaskLeft.x = - 90;
    this._graphicsLeftCircle.mask = this._loadingBarMaskLeft;

    this._loadingBarMaskRight = loadingBarMaskRight;
    this._loadingBarMaskRight.anchor.set(0.5);
    this._loadingBarMaskRight.x = 87;
    this._graphicsRightCircle.mask = this._loadingBarMaskRight;

    this.addChild(this._background);
    this.addChild(this._loadingBarMaskLeft);
    this.addChild(this._loadingBarMaskRight);
    this.addChild(this._graphicsLeftCircle);
    this.addChild(this._graphicsRightCircle);
  }

}