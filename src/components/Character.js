import { TimelineLite } from 'gsap/gsap-core';
import { Container, Graphics, Sprite } from 'pixi.js';
import Assets from '../core/AssetManager';
import { random } from '../core/utils';

export default class Character extends Container {
  constructor(openedEyes = false) {
    super();
    this.init(openedEyes);
    this.interactive = true;
    this.eyesOpened = false;

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

    const eyeLidsMask = new Graphics();
    this.eyeLidsMask = eyeLidsMask;
    this.eyeLidsMask.beginFill(0x8bc5ff);
    this.eyeLidsMask.drawCircle(130, 125, 43);

    this.monsterEye = monsterEye;
    this.monsterEye.anchor.set(0.5);
    this.monsterEyeLidTop = monsterEyeLidTop;
    this.monsterEyeLidBottom = monsterEyeLidBottom;

    this.monsterEye.x = 132;
    this.monsterEye.y = 125;

    this.monsterEyeLidTop.x = 88;
    this.monsterEyeLidTop.y = 84;
    this.monsterEyeLidTop.mask = this.eyeLidsMask;

    this.monsterEyeLidBottom.x = 88;
    this.monsterEyeLidBottom.y = 134;
    this.monsterEyeLidBottom.mask = this.eyeLidsMask;

    this.addChild(monsterBody);
    this.addChild(this.monsterEye);
    this.addChild(this.eyeLidsMask);

    if (!openedEyes) {
      this.addChild(this.monsterEyeLidTop);
      this.addChild(this.monsterEyeLidBottom);
      this._startBlinking();
    }

    this.on('pointermove', this._moveEyesToCursor);
  }

  /**
   * Activates the periodical blinking of the the monsters
   * 
   * @method
   * @private
   * @memberof Character
   */
  _startBlinking() {
    const randomRepeatTime = random(7, 15);
    const timeline = new TimelineLite();

    timeline.to(this.monsterEyeLidTop, { pixi: { scaleX: 1.065, scaleY: 1.25, positionX: this.monsterEyeLidTop.x - 2 } }, 'close');
    timeline.to(this.monsterEyeLidBottom, { pixi: { scaleX: 1.065, scaleY: 1.25, positionX: this.monsterEyeLidBottom.x - 2, positionY: this.monsterEyeLidBottom.y - 10 } }, 'close');

    timeline.to(this.monsterEyeLidTop, { pixi: { scaleX: 1, scaleY: 1, positionX: this.monsterEyeLidTop.x }, }, 'open');
    timeline.to(this.monsterEyeLidBottom, { pixi: { scaleX: 1, scaleY: 1, positionX: this.monsterEyeLidBottom.x, positionY: this.monsterEyeLidBottom.y } }, 'open');

    timeline.repeat(-1).repeatDelay(randomRepeatTime);
  }

  /**
   * Opens the eyes of the monsters when there is a match of 4 or more Tiles
   * 
   * @method
   * @private
   * @memberof Character
   */
  _openEyes() {
    const timeline = new TimelineLite();
    const defaultTopLidPosition = this.monsterEyeLidTop.y;
    const defaultBottomLidPosition = this.monsterEyeLidBottom.y;

    if (!this.eyesOpened) {
      this.eyesOpened = true;

      timeline.to(this.monsterEyeLidTop, { pixi: { positionY: defaultTopLidPosition - 100 } }, 'open');
      timeline.to(this.monsterEyeLidBottom, {
        pixi: {
          positionY: defaultBottomLidPosition +
            100
        }
      }, 'open');

      timeline.to(this.monsterEyeLidTop, { pixi: { positionY: defaultTopLidPosition } }, 'close');
      timeline.to(this.monsterEyeLidBottom, { pixi: { positionY: defaultBottomLidPosition } }, 'close').then(() => {
        this.eyesOpened = false;
      });
    }
  }

  /**
   * Handles the eye moving of the monsters according to the mouse position
   * 
   * @method
   * @private
   * @param {Event} e
   * @memberof Character
   */
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