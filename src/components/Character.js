import { Container, Sprite } from "pixi.js";
import Assets from '../core/AssetManager';

export default class Character extends Container {
  constructor(openedEyes = false) {
    super();
    this.init(openedEyes);
  }

  async init(openedEyes) {
    await this._createBody(openedEyes);
  }

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

    monsterEye.x = 105;
    monsterEye.y = 100;

    monsterEyeLidTop.x = 88;
    monsterEyeLidTop.y = 84;

    monsterEyeLidBottom.x = 88;
    monsterEyeLidBottom.y = 134;

    this.addChild(monsterBody);
    this.addChild(monsterEye);
    if (!openedEyes) {
      this.addChild(monsterEyeLidTop);
      this.addChild(monsterEyeLidBottom);
    }
  }
}