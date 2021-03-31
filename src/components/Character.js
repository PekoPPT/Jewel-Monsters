import { TimelineLite } from 'gsap/gsap-core';
import { Container, Sprite } from 'pixi.js';
import Assets from '../core/AssetManager';
import { random } from '../core/utils';

export default class Character extends Container {
  constructor(openedEyes = false) {
    super();
    this.init(openedEyes);
    this.interactive = true;
  }

  async init(openedEyes) {
    await this._createBody(openedEyes);
  }

  /**
   * Initizlizes Monster's body elements and assembles the final appearance
   *
   * @param {Boolean} openedEyes - Defines if the eyes of the Monster will be opened or not - If the eye lids will be displayed
   * @method
   * @private
   * @memberof Character
   */
  async _createBody(openedEyes) {
    const images = {
      'monster-body': Assets.images['char-body'],
      'monster-body-smile': Assets.images['char-body-smile'],
      'monster-eye': Assets.images['char-eye'],
      'monster-eye-lid-top': Assets.images['char-lid-top'],
      'monster-eye-lid-bottom': Assets.images['char-lid-bottom'],
    };

    await Assets.load({ images });
    await Assets.prepareImages(images);
    let monsterBody;

    if (!openedEyes) {
      monsterBody = new Sprite.from('monster-body');
    } else {
      monsterBody = new Sprite.from('monster-body-smile');
    }

    const monsterEye = new Sprite.from('monster-eye');
    const monsterEyeLidTop = new Sprite.from('monster-eye-lid-top');
    const monsterEyeLidBottom = new Sprite.from('monster-eye-lid-bottom');

    this.monsterEye = monsterEye;
    this.monsterEye.anchor.set(0.5);
    this.monsterEyeLidTop = monsterEyeLidTop;
    this.monsterEyeLidBottom = monsterEyeLidBottom;

    this.monsterEye.x = 132;
    this.monsterEye.y = 125;

    this.monsterEyeLidTop.x = 88;
    this.monsterEyeLidTop.y = 84;

    this.monsterEyeLidBottom.x = 88;
    this.monsterEyeLidBottom.y = 134;

    this.addChild(monsterBody);
    this.addChild(this.monsterEye);
    if (!openedEyes) {
      this.addChild(this.monsterEyeLidTop);
      this.addChild(this.monsterEyeLidBottom);
      this._startBlinking();
    }

    this.on('pointermove', this._moveEyesToCursor);

  }

  _startBlinking() {
    const randomRepeatTime = random(7, 15);

    const timeline = new TimelineLite();

    timeline.to(this.monsterEyeLidTop, { pixi: { scaleX: 1.065, scaleY: 1.25, positionX: this.monsterEyeLidTop.x - 2 } }, 'close');
    timeline.to(this.monsterEyeLidBottom, { pixi: { scaleX: 1.065, scaleY: 1.25, positionX: this.monsterEyeLidBottom.x - 2, positionY: this.monsterEyeLidBottom.y - 10 } }, 'close');

    timeline.to(this.monsterEyeLidTop, { pixi: { scaleX: 1, scaleY: 1, positionX: this.monsterEyeLidTop.x }, }, 'open');
    timeline.to(this.monsterEyeLidBottom, { pixi: { scaleX: 1, scaleY: 1, positionX: this.monsterEyeLidBottom.x, positionY: this.monsterEyeLidBottom.y } }, 'open');

    timeline.repeat(-1).repeatDelay(randomRepeatTime);
  }

  _moveEyesToCursor(e) {
    const coordinates = e.data.global;

    const cursorX = coordinates.x;
    const cursorY = coordinates.y;

    const monsterWorldPosition = this.monsterEye.worldTransform;

    const getXDistance = cursorX - monsterWorldPosition.tx;
    const getYDistance = cursorY - monsterWorldPosition.ty;

    const radianDegrees = Math.atan2(getXDistance, getYDistance);
    const rotationDegrees = (radianDegrees * (180 / Math.PI) * -1) + 180;

    this.monsterEye.anchor.set(0.55);
    this.monsterEye.angle = rotationDegrees + 90;

  }
}