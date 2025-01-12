import { checkValidNumbers, checkValidStrings, validateNumbers, validateStrings } from "../utilities/validation";

export const ComponentTypes = {
  VELOCITY: 'Velocity',
  CIRCLE_SHAPE: 'CircleShape',
  RECT_SHAPE: 'RectShape',
  TRANSFORM: 'Transform',
  COLLIDER: 'Collider',
  BOX_COLLIDER: 'BoxCollider',
  CIRCLE_COLLIDER: 'CircleCollider'
};

export class Component {
  constructor(type) {
    validateStrings(type);
    this.type = type;
  }
}

export class Transform extends Component {
  constructor(x = 0, y = 0, rotation = 0, scale = 1, pivotX = 0, pivotY = 0) {
    super(ComponentTypes.TRANSFORM);
    validateNumbers(x, y, rotation, scale);
    
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
    validateNumbers(vx, vy);
    
    this.vx = vx;
    this.vy = vy;
  }
}

export class CircleShape extends Component {
  constructor(radius, fillColor = null, strokeColor = null, strokeWidth = 0) {
    super(ComponentTypes.CIRCLE_SHAPE);
    validateNumbers(radius, strokeWidth);
    if (fillColor !== null) validateNumbers(fillColor);
    if (strokeColor !== null) validateNumbers(strokeColor);
    
    this.radius = radius;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }
}

export class RectShape extends Component {
  constructor(width, height, fillColor = null, strokeColor = null, strokeWidth = 0) {
    super(ComponentTypes.RECT_SHAPE);
    validateNumbers(width, height, strokeWidth);
    if (fillColor !== null) validateNumbers(fillColor);
    if (strokeColor !== null) validateNumbers(strokeColor);

    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }
}

export class Collider extends Component {
  constructor(subType) {
    super(ComponentTypes.COLLIDER);
    validateStrings(subType);
    this.subType = subType;
  }
}

export class BoxCollider extends Collider {
  constructor(width, height) {
    super(ComponentTypes.BOX_COLLIDER);
    validateNumbers(width, height);
    this.width = width;
    this.height = height;
  }
}

export class CircleCollider extends Collider {
  constructor(radius) {
    super(ComponentTypes.CIRCLE_COLLIDER);
    validateNumbers(radius);
    this.radius = radius;
  }
}
