import { Sprite, Application, Container } from 'pixi.js';
import config from '../config';
import Game from '../Game';
import { Viewport } from 'pixi-viewport';
import { center } from './utils';
import Assets from './AssetManager';
import Fire from '../components/Fire';

/**
 * Game entry point. Holds the game's viewport and responsive background
 * All configurations are described in src/config.js
 */
export default class GameApplication extends Application {
  constructor() {
    super(config.view);
    this.config = config;
    Assets.renderer = this.renderer;
    this._applicationWidth = window.innerWidth;
    this._applicationHeight = window.innerHeight;

    this.setupViewport();
    this.initGame();
  }

  /**
   * Game main entry point. Loads and prerenders assets.
   * Creates the main game container.
   *
   */
  async initGame() {
    await this.createBackground();
    await this.addFire();

    this.game = new Game({
      background: this.background,
    });
    this.viewport.addChild(this.game);

    center(this.viewport, this.config.view);
    this.onResize();

    this.game.start();
  }

  /**
     * Initialize the game world viewport.
     * Supports handly functions like dragging and panning on the main game stage
     *
     * @return {PIXI.Application}
     */
  setupViewport() {
    const viewport = new Viewport({
      screenWidth: this.config.view.width,
      screenHeight: this.config.view.height,
      worldWidth: this.config.game.width,
      worldHeight: this.config.game.height,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: this.renderer.plugins.interaction,
    });

    this.renderer.runners.resize.add({
      resize: this.onResize.bind(this),
    });
    document.body.appendChild(this.view);

    this.stage.addChild(viewport);

    if (this.config.game.drag) viewport.drag();
    if (this.config.game.pinch) viewport.pinch();
    if (this.config.game.wheel) viewport.wheel();
    if (this.config.game.decelerate) viewport.decelerate();

    this.viewport = viewport;
  }

  /**
     * Called after the browser window has been resized.
     * Implement game specific resize logic here
     * @param  {PIXI.Application} app The PIXI Appliaction instance
     * @param  {Number} width         The updated viewport width
     * @param  {Number} height        The updated viewport width
     */
  onResize(width = this.config.view.width, height = this.config.view.height) {

    this.background.x = width / 2;
    this.background.y = height / 2;
    this.game.onResize(width, height);

    if (this.config.view.centerOnResize) {
      this.viewport.x = width / 2;
      this.viewport.y = height / 2;
    }
    this.scaleGameBasedOnResolution(width, height);
  }

  /**
   * Resize the viewport & background based on the screen width.
   *
   * @param {Number} width
   * @param {Number} height
   * @memberof GameApplication
   */
  scaleGameBasedOnResolution(width = this.config.view.width, height = this.config.view.height) {
    const widthRatio = width / this.background.width;
    const heightRatio = height / this.background.height;

    const scaleFactor = widthRatio > heightRatio ? widthRatio : heightRatio;

    this.viewport.scale.set(scaleFactor);
    this.background.scale.set(scaleFactor);
    this.fireContainer.scale.set(scaleFactor);
  }

  /**
   * Initializes the static background that is used to
   * fill the empty space around our game stage. This is used to compensate for the different browser window sizes.
   *
   */
  async createBackground() {
    const images = {
      background: Assets.images.bg,
    };

    await Assets.load({ images });
    await Assets.prepareImages(images);

    const background = Sprite.from('background');

    this.background = background;
    this.background.anchor.set(0.5);
    this.background.name = 'background';

    this.stage.addChildAt(background);
  }

  /**
   * Adds and positions Fire objects above the background of the game
   *
   * @param {Number} [width=this.config.view.width]
   * @param {Number} [height=this.config.view.height]
   * @memberof GameApplication
   */
  async addFire(width = this.config.view.width, height = this.config.view.height) {
    const images = {
      fire: Assets.images.fire,
      fireGlow: Assets.images['fire-glow']
    };

    await Assets.load({ images });
    await Assets.prepareImages(images);

    const fireContainer = new Container();
    this.fireContainer = fireContainer;
    this.fireContainer.x = width / 2 + width * 0.048;
    this.fireContainer.y = height / 2 + height * 0.13;

    const fireLeft = new Fire();
    const fireRight = new Fire();

    this.fireLeft = fireLeft;
    this.fireLeft.x = -749;
    this.fireLeft.y = -26;

    this.fireRight = fireRight;
    this.fireRight.x = 631;
    this.fireRight.y = -26;

    this.fireContainer.addChild(this.fireLeft);
    this.fireContainer.addChild(this.fireRight);

    this.stage.addChild(this.fireContainer);
  }
}

