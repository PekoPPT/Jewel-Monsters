import Splash from './scenes/Splash';
import Play from './scenes/Play';
import { Container } from 'pixi.js';
import snow from './static/snow.json';
import leaf from './static/leaf.json';
import fire from './static/fire.json';
import vortex from './static/vortex.json';
import potion from './static/potion.json';
import skull from './static/skull.json';

import Assets from './core/AssetManager';

/**
 * Main game stage, manages scenes/levels.
 *
 * @extends {PIXI.Container}
 */
export default class Game extends Container {

  static get events() {
    return {
      SWITCH_SCENE: 'switch_scene'
    };
  }

  /**
   * @param {PIXI.Sprite} background 
   */
  constructor({ background } = {}) {
    super();

    this._background = background;
    this.currentScene = null;
  }

  async start() {
    await this.switchScene(Splash, { scene: 'splash' });
    await this.currentScene.finish;

    await Assets.prepareSpritesheets([
      { texture: 'snowTileSpriteSheet', data: snow },
      { texture: 'leafTileSpriteSheet', data: leaf },
      { texture: 'skullTileSpriteSheet', data: skull },
      { texture: 'flameTileSpriteSheet', data: fire },
      { texture: 'vortexTileSpriteSheet', data: vortex },
      { texture: 'potionTileSpriteSheet', data: potion }
    ]);

    this.switchScene(Play, { scene: 'play' });
  }

  /**
   * @param {Function} constructor 
   * @param {String} scene 
   */
  switchScene(constructor, scene) {
    this.removeChild(this.currentScene);
    this.currentScene = new constructor();
    this.currentScene.background = this._background;
    this.addChild(this.currentScene);

    this.emit(Game.events.SWITCH_SCENE, { scene });

    return this.currentScene.onCreated();
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {
    if (this.currentScene === null) return;

    this.currentScene.onResize(width, height);
  }
}
