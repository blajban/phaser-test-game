import { ComponentTypes } from "../components/Components";
import { cleanupGraphics, drawCircle, drawRectangle } from "../utilities/draw";
import System from "./System";

export class GraphicsRenderSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
  }

  update(world) {
    try {
      this.renderRectangles(world);
    } catch(err) {}
    
    try {
      this.renderCircles(world);
    } catch (err) {}
    
    cleanupGraphics(world.getAllEntities());
  }

  renderRectangles(world) {
    const entities = world.getEntitiesWithComponentArchetype(
      ComponentTypes.TRANSFORM,
      ComponentTypes.RECT_SHAPE
    );

    for (const entity of entities) {
      const transform = world.getComponent(entity, ComponentTypes.TRANSFORM);
      const rectShape = world.getComponent(entity, ComponentTypes.RECT_SHAPE);

      drawRectangle(
        this.scene,
        entity,
        transform.x,
        transform.y,
        rectShape.width,
        rectShape.height,
        transform.scale,
        transform.rotation,
        transform.pivotX,
        transform.pivotY,
        rectShape.fillColor,
        rectShape.strokeColor,
        rectShape.strokeWidth
      );
    }
  }

  renderCircles(world) {
    const entities = world.getEntitiesWithComponentArchetype(
      ComponentTypes.TRANSFORM,
      ComponentTypes.CIRCLE_SHAPE
    );

    for (const entity of entities) {
      const transform = world.getComponent(entity, ComponentTypes.TRANSFORM);
      const circleShape = world.getComponent(entity, ComponentTypes.CIRCLE_SHAPE);

      drawCircle(
        this.scene,
        entity,
        transform.x,
        transform.y,
        circleShape.radius,
        transform.scale,
        circleShape.fillColor,
        circleShape.strokeWidth,
        circleShape.strokeColor
      );
    }
  }
}