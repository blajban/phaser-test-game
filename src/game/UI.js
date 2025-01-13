import { validateNumbers } from "../engine/utilities/validation";
import { CustomComponentTypes } from "../scenes/MainScene";
import { Component, ComponentTypes, Transform, Text } from "../engine/components/Components";
import System from "../engine/systems/System";

export class ScoreText extends Component {
  constructor() {
    super(CustomComponentTypes.SCORE_TEXT);
  }
}

export function createScoreText(world) {
  const scoreText = world.createEntity([
    new Transform(10, 10),
    new Text('Score: 0'),
    new ScoreText()
  ]);
}

export class ScoreSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
  }

  update(world, time, delta) {
    const scoreEntity = world.getEntitiesWithComponent(CustomComponentTypes.SCORE_TEXT)[0];
    const textComponent = world.getComponent(scoreEntity, ComponentTypes.TEXT);
    
    const playerEntity = world.getEntitiesWithComponent(CustomComponentTypes.PLAYER)[0];
    const scoreComponent = world.getComponent(playerEntity, CustomComponentTypes.SCORE);

    textComponent.text = `Score: ${scoreComponent.score}`;
  }
}