import { checkValidNumbers, checkValidStrings } from "../utilities/validation";

export const ComponentTypes = {
  VELOCITY: 'Velocity',
  CIRCLE_SHAPE: 'Circle_shape',
  RECT_SHAPE: 'Rect_shape',
  TRANSFORM: 'Transform',
};

export class Component {
  constructor(type) {
    checkValidStrings(type);
    this.type = type;
  }
}

export class Transform extends Component {
  constructor(x = 0, y = 0, rotation = 0, scale = 1, pivotX = 0, pivotY = 0) {
    super(ComponentTypes.TRANSFORM);
    checkValidNumbers(x, y, rotation, scale);
    
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.scale = scale;
    this.pivotX = pivotX;
    this.pivotY = pivotY;
  }
}

export class Velocity extends Component {
  constructor(vx = 0, vy = 0) {
    super(ComponentTypes.VELOCITY);
    checkValidNumbers(vx, vy);
    
    this.vx = vx;
    this.vy = vy;
  }
}

export class CircleShape extends Component {
  constructor(radius, fillColor = null, strokeColor = null, strokeWidth = 0) {
    super(ComponentTypes.CIRCLE_SHAPE);
    checkValidNumbers(radius, strokeWidth);
    if (fillColor !== null) checkValidNumbers(fillColor);
    if (strokeColor !== null) checkValidNumbers(strokeColor);
    
    this.radius = radius;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }
}

export class RectShape extends Component {
  constructor(width, height, fillColor = null, strokeColor = null, strokeWidth = 0) {
    super(ComponentTypes.RECT_SHAPE);
    checkValidNumbers(width, height, strokeWidth);
    if (fillColor !== null) checkValidNumbers(fillColor);
    if (strokeColor !== null) checkValidNumbers(strokeColor);

    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }
}
