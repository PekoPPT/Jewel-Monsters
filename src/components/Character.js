import { Container, Sprite } from "pixi.js";
import Assets from '../core/AssetManager';

export default class Character extends Container {
  constructor() {
    super();
    this.init();
  }

  async init() {
    await this._createBody();
  }

  async _createBody() {
    const images = {
      'monster-body': Assets.images['char-body'],
      'monster-eye': Assets.images['char-eye'],
      'monster-eye-lid-top': Assets.images['char-lid-top'],
      'monster-eye-lid-bottom': Assets.images['char-lid-bottom'],
    };

    await Assets.load({ images });
    await Assets.prepareImages(images);

    const monsterBody = new Sprite.from('monster-body');
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
    this.addChild(monsterEyeLidTop);
    this.addChild(monsterEyeLidBottom);
  }
}