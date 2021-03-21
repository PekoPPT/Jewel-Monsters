import { Sprite } from 'pixi.js';
import Scene from './Scene';
import { gsap, Sine } from 'gsap';
import Footer from '../components/Footer';
import Character from '../components/Character';
import Moves from '../components/Moves';
import ProgressBar from '../components/ProgressBar';
import Tiles from '../components/Tiles';

export default class Play extends Scene {
  constructor() {
    super();
    this.movesToPlay = 20;

  }
  async onCreated() {
    await this.addMonsters();
    await this.addMovesPanel();
    await this.addProgressBar();
    await this.addTiles();

    // let i = 20;
    // let score = 20;
    // setInterval(() => {
    //   // this.movesPanel.changeMoves(i);
    //   this.progressBar.changeScore(score);
    //   this.progressBar.set(score);
    //   i -= 1;
    //   score += 400;
    // }, 100);
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars

  }

  async addTiles() {
    const that = this;
    const tiles = new Tiles();
    this.tiles = tiles;
    this.tiles.x = - 280;
    this.tiles.y = - 211;
    this.tiles.on('move_made', function moveMade() {
      console.log("move made");
      that.movesToPlay -= 1;
      that.movesPanel.changeMoves(that.movesToPlay);
      that.tiles._checkForIdenticalElements();
    });
    this.tiles.on('calculations_ready', function calculations_ready(scoreToChange, lastElementOfMatch) {
      // console.log(lastElementOfMatch.x);
      that.progressBar.changeScore(scoreToChange);
      var textSample = new PIXI.Text(scoreToChange + 'XP', { font: '35px Snippet', fill: 'white', align: 'left' });
      that.addChild(textSample);
      // textSample.position.y = row * 100;
      gsap.to(textSample, { pixi: { scale: 2, autoAlpha: 0 }, duration: 3 }).then(() => {
        textSample.destroy();
      });
    });
    this.addChild(this.tiles);
  }

  async addMonsters() {
    const monsterBig = new Character();
    const monsterSmall = new Character();

    monsterBig.x = -623;
    monsterBig.y = -111;
    gsap.to(monsterBig, {
      pixi: { y: -90 }, yoyo: true, repeat: -1, duration: 3, ease: Sine.easeInOut
    });

    monsterSmall.x = 345;
    monsterSmall.y = -305;
    monsterSmall.scale.set(0.4);
    gsap.to(monsterSmall, {
      pixi: { y: -280 }, yoyo: true, repeat: -1, duration: 6, ease: Sine.easeInOut
    });


    this.addChild(monsterBig);
    this.addChild(monsterSmall);
  }

  async addMovesPanel() {
    this.movesPanel = new Moves();
    this.movesPanel.x = - 2;
    this.movesPanel.y = - 480;

    this.addChild(this.movesPanel);
  }

  async addProgressBar() {
    const progressBar = new ProgressBar();
    this.progressBar = progressBar;
    this.progressBar.on("game_won", function gameWon() {
      console.log("GameWon");

    })
    this.addChild(this.progressBar);
  }
}
