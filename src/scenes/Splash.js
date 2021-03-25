import Assets from '../core/AssetManager';
import Scene from './Scene';
import config from '../config';
import LoadingBar from '../components/LoadingBar';

export default class Splash extends Scene {
  constructor() {
    super();

    this.loadingBar = new LoadingBar({ max: 100, value: 0, width: 500 });
    this.loadingBar.y = 20;
    this.config = config.scenes.Splash;

    this.addChild(this.loadingBar);
  }

  get finish() {

    return new Promise((res) => setTimeout(res, this.config.hideDelay));
  }

  preload() {
    const images = {
      logo: Assets.images.logo,
      avatar: Assets.images.avatar,
      fireGlow: Assets.images['fire-glow'],
      movesBackground: Assets.images['moves-bg'],
      movesText: Assets.images.moves,
      scoreBase: Assets.images['score-base'],
      playAgain: Assets.images['play-again'],
      loadingLeft: Assets.images['loading-left'],
      loadingRight: Assets.images['loading-right'],
      loadingMiddle: Assets.images['loading-middle'],
      labelPassed: Assets.images['label-passed'],
      labelFailed: Assets.images['label-failed'],
      xp: Assets.images.xp,
      toolTip: Assets.images.tooltip,
      zeroDigit: Assets.images['images/0'],
      oneDigit: Assets.images['images/1'],
      twoDigit: Assets.images['images/2'],
      threeDigit: Assets.images['images/3'],
      fourDigit: Assets.images['images/4'],
      fiveDigit: Assets.images['images/5'],
      sixDigit: Assets.images['images/6'],
      sevenDigit: Assets.images['images/7'],
      eightDigit: Assets.images['images/8'],
      nineDigit: Assets.images['images/9'],
      xSymbol: Assets.images['images/X'],
      pSymbol: Assets.images['images/P'],
      snowTile: Assets.images['symbol-1'],
      leafTile: Assets.images['symbol-2'],
      flameTile: Assets.images['symbol-3'],
      potionTile: Assets.images['symbol-4'],
      vortexTile: Assets.images['symbol-5'],
      skullTile: Assets.images['symbol-6'],
    };
    const sounds = {
      stoneHit: Assets.sounds['sounds/stone-hitting-big-stone'],
      scrapingStone: Assets.sounds['sounds/scraping-stone'],
      createureInTheCave: Assets.sounds['sounds/creature-in-da-cave'],
      jingleAchievement: Assets.sounds['sounds/jingle-achievement'],
      loseGameSound: Assets.sounds['sounds/gear-shif-fail-scratch'],
      horrorcaveambience: Assets.sounds['sounds/horrorcaveambience']
    };

    return super.preload({ images, sounds }).then(() => {

    });
  }

  onResize(width, height) { // eslint-disable-line no-unused-vars
    this.loadingText.x = width / 2;
    this.loadingText.y = (height / 2) + 500;
  }

  onLoadProgress(val) {
    this.loadingBar.set({ value: val * 2 });
  }
}
