const graphicsMap = new Map();

export function getGraphics(scene, entity) {
  if (!graphicsMap.has(entity)) {
    const graphics = scene.add.graphics();
    graphicsMap.set(entity, graphics);
  }
  return graphicsMap.get(entity);
}

export function destroyGraphics(entity) {
  if (graphicsMap.has(entity)) {
    graphicsMap.get(entity).destroy();
    graphicsMap.delete(entity);
  }
}

export function cleanupGraphics(validEntities) {
  for (const [entity, graphics] of graphicsMap.entries()) {
    if (!validEntities.includes(entity)) {
      graphics.destroy();
      graphicsMap.delete(entity);
    }
  }
}

export function drawCircle(scene, entity, transformX, transformY, radius, scale, fillColor, strokeWidth, strokeColor) {
  const graphics = getGraphics(scene, entity);
  graphics.clear();

  graphics.x = transformX;
  graphics.y = transformY;

  const scaledRadius = radius * scale;

  if (fillColor !== null) {
    graphics.fillStyle(fillColor);
    graphics.fillCircle(0, 0, scaledRadius);
  }

  if (strokeColor !== null) {
    graphics.lineStyle(strokeWidth, strokeColor);
    graphics.strokeCircle(0, 0, scaledRadius);
  }
}

function drawRegularRectangle(graphics, transformX, transformY, pivotX, pivotY, scaledWidth, scaledHeight, fillColor, strokeColor, strokeWidth) {
  const pivotAdjustedX = transformX - (pivotX * scaledWidth) / 2;
  const pivotAdjustedY = transformY - (pivotY * scaledHeight) / 2;

  graphics.x = pivotAdjustedX;
  graphics.y = pivotAdjustedY;
  
  if (fillColor !== null) {
    graphics.fillStyle(fillColor);
    graphics.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
  }

  if (strokeColor !== null) {
    graphics.lineStyle(strokeWidth, strokeColor);
    graphics.strokeRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
  }
}

// Works for the prototype game, but pivot/rotation needs fixing...
function drawRotatedRectangle(graphics, transformX, transformY, pivotX, pivotY, scaledWidth, scaledHeight, rotation, fillColor, strokeColor, strokeWidth) {
  const halfWidth = scaledWidth / 2;
  const halfHeight = scaledHeight / 2;
  const pivotOffsetX = (pivotX * scaledWidth) / 2;
  const pivotOffsetY = (pivotY * scaledHeight) / 2;
  
  const angle = rotation;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const points = [
    { x: -halfWidth - pivotOffsetX, y: -halfHeight - pivotOffsetY }, // Top-left
    { x: halfWidth - pivotOffsetX, y: -halfHeight - pivotOffsetY },  // Top-right
    { x: halfWidth - pivotOffsetX, y: halfHeight - pivotOffsetY },   // Bottom-right
    { x: -halfWidth - pivotOffsetX, y: halfHeight - pivotOffsetY },  // Bottom-left
  ].map((point) => ({
    x: (point.x * cos - point.y * sin) + pivotOffsetX,
    y: (point.x * sin + point.y * cos) + pivotOffsetY,
  }));

  if (fillColor !== null) {
    graphics.fillStyle(fillColor);
    graphics.fillPoints(points, true);
  }

  if (strokeColor !== null) {
    graphics.lineStyle(strokeWidth, strokeColor);
    graphics.strokePoints(points, true);
  }
}

export function drawRectangle(scene, entity, transformX, transformY, width, height, scale, rotation, pivotX, pivotY, fillColor, strokeColor, strokeWidth) {
  const graphics = getGraphics(scene, entity);
  graphics.clear();

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Draw non rotated rectangle
  if (rotation === 0) {
    drawRegularRectangle(graphics, transformX, transformY, pivotX, pivotY, scaledWidth, scaledHeight, fillColor, strokeColor, strokeWidth);
    return;
  }

  drawRotatedRectangle(graphics, transformX, transformY, pivotX, pivotY, scaledWidth, scaledHeight, rotation, fillColor, strokeColor, strokeWidth);
  
}
