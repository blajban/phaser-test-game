import { ComponentTypes } from "../components/Components";
import { drawText, cleanupText } from "../utilities/draw";
import System from "./System";

export default class TextRenderSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
  }

  update(world, time, delta) {
    this.renderText(world);
    cleanupText(world.getAllEntities());
  }

  renderText(world) {
    const entities = world.getEntitiesWithComponentArchetype(
      ComponentTypes.TEXT,
      ComponentTypes.TRANSFORM
    );

    for (const entity of entities) {
      const textComponent = world.getComponent(entity, ComponentTypes.TEXT);
      const transform = world.getComponent(entity, ComponentTypes.TRANSFORM);

      drawText(this.scene, entity, transform.x, transform.y, textComponent.text, textComponent.fontSize, textComponent.color);
    }
  }
}