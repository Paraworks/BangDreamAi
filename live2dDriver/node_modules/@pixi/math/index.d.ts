/// <reference path="./global.d.ts" />

/**
 * The Circle object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
 * @memberof PIXI
 */
export declare class Circle {
    /** @default 0 */
    x: number;
    /** @default 0 */
    y: number;
    /** @default 0 */
    radius: number;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default PIXI.SHAPES.CIRC
     * @see PIXI.SHAPES
     */
    readonly type: SHAPES.CIRC;
    /**
     * @param x - The X coordinate of the center of this circle
     * @param y - The Y coordinate of the center of this circle
     * @param radius - The radius of the circle
     */
    constructor(x?: number, y?: number, radius?: number);
    /**
     * Creates a clone of this Circle instance
     * @returns A copy of the Circle
     */
    clone(): Circle;
    /**
     * Checks whether the x and y coordinates given are contained within this circle
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @returns Whether the x/y coordinates are within this Circle
     */
    contains(x: number, y: number): boolean;
    /**
     * Returns the framing rectangle of the circle as a Rectangle object
     * @returns The framing rectangle
     */
    getBounds(): Rectangle;
    toString(): string;
}

/**
 * Conversion factor for converting degrees to radians.
 * @static
 * @member {number}
 * @memberof PIXI
 */
export declare const DEG_TO_RAD: number;

/**
 * The Ellipse object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
 * @memberof PIXI
 */
export declare class Ellipse {
    /** @default 0 */
    x: number;
    /** @default 0 */
    y: number;
    /** @default 0 */
    width: number;
    /** @default 0 */
    height: number;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default PIXI.SHAPES.ELIP
     * @see PIXI.SHAPES
     */
    readonly type: SHAPES.ELIP;
    /**
     * @param x - The X coordinate of the center of this ellipse
     * @param y - The Y coordinate of the center of this ellipse
     * @param halfWidth - The half width of this ellipse
     * @param halfHeight - The half height of this ellipse
     */
    constructor(x?: number, y?: number, halfWidth?: number, halfHeight?: number);
    /**
     * Creates a clone of this Ellipse instance
     * @returns {PIXI.Ellipse} A copy of the ellipse
     */
    clone(): Ellipse;
    /**
     * Checks whether the x and y coordinates given are contained within this ellipse
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @returns Whether the x/y coords are within this ellipse
     */
    contains(x: number, y: number): boolean;
    /**
     * Returns the framing rectangle of the ellipse as a Rectangle object
     * @returns The framing rectangle
     */
    getBounds(): Rectangle;
    toString(): string;
}

declare type GD8Symmetry = number;

/**
 * Implements the dihedral group D8, which is similar to
 * [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html};
 * D8 is the same but with diagonals, and it is used for texture
 * rotations.
 *
 * The directions the U- and V- axes after rotation
 * of an angle of `a: GD8Constant` are the vectors `(uX(a), uY(a))`
 * and `(vX(a), vY(a))`. These aren't necessarily unit vectors.
 *
 * **Origin:**<br>
 *  This is the small part of gameofbombs.com portal system. It works.
 * @see PIXI.groupD8.E
 * @see PIXI.groupD8.SE
 * @see PIXI.groupD8.S
 * @see PIXI.groupD8.SW
 * @see PIXI.groupD8.W
 * @see PIXI.groupD8.NW
 * @see PIXI.groupD8.N
 * @see PIXI.groupD8.NE
 * @author Ivan @ivanpopelyshev
 * @namespace PIXI.groupD8
 * @memberof PIXI
 */
export declare const groupD8: {
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 0°       | East      |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    E: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 45°↻     | Southeast |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    SE: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 90°↻     | South     |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    S: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 135°↻    | Southwest |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    SW: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 180°     | West      |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    W: number;
    /**
     * | Rotation    | Direction    |
     * |-------------|--------------|
     * | -135°/225°↻ | Northwest    |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    NW: number;
    /**
     * | Rotation    | Direction    |
     * |-------------|--------------|
     * | -90°/270°↻  | North        |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    N: number;
    /**
     * | Rotation    | Direction    |
     * |-------------|--------------|
     * | -45°/315°↻  | Northeast    |
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    NE: number;
    /**
     * Reflection about Y-axis.
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    MIRROR_VERTICAL: number;
    /**
     * Reflection about the main diagonal.
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    MAIN_DIAGONAL: number;
    /**
     * Reflection about X-axis.
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    MIRROR_HORIZONTAL: number;
    /**
     * Reflection about reverse diagonal.
     * @memberof PIXI.groupD8
     * @constant {PIXI.GD8Symmetry}
     */
    REVERSE_DIAGONAL: number;
    /**
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
     * @returns {PIXI.GD8Symmetry} The X-component of the U-axis
     *    after rotating the axes.
     */
    uX: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
     * @returns {PIXI.GD8Symmetry} The Y-component of the U-axis
     *    after rotating the axes.
     */
    uY: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
     * @returns {PIXI.GD8Symmetry} The X-component of the V-axis
     *    after rotating the axes.
     */
    vX: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
     * @returns {PIXI.GD8Symmetry} The Y-component of the V-axis
     *    after rotating the axes.
     */
    vY: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
     *   is needed. Only rotations have opposite symmetries while
     *   reflections don't.
     * @returns {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
     */
    inv: (rotation: GD8Symmetry) => GD8Symmetry;
    /**
     * Composes the two D8 operations.
     *
     * Taking `^` as reflection:
     *
     * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
     * |-------|-----|-----|-----|-----|------|-------|-------|-------|
     * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
     * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
     * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
     * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
     * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
     * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
     * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
     * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
     *
     * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
     *   is the row in the above cayley table.
     * @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
     *   is the column in the above cayley table.
     * @returns {PIXI.GD8Symmetry} Composed operation
     */
    add: (rotationSecond: GD8Symmetry, rotationFirst: GD8Symmetry) => GD8Symmetry;
    /**
     * Reverse of `add`.
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
     * @param {PIXI.GD8Symmetry} rotationFirst - First operation
     * @returns {PIXI.GD8Symmetry} Result
     */
    sub: (rotationSecond: GD8Symmetry, rotationFirst: GD8Symmetry) => GD8Symmetry;
    /**
     * Adds 180 degrees to rotation, which is a commutative
     * operation.
     * @memberof PIXI.groupD8
     * @param {number} rotation - The number to rotate.
     * @returns {number} Rotated number
     */
    rotate180: (rotation: number) => number;
    /**
     * Checks if the rotation angle is vertical, i.e. south
     * or north. It doesn't work for reflections.
     * @memberof PIXI.groupD8
     * @param {PIXI.GD8Symmetry} rotation - The number to check.
     * @returns {boolean} Whether or not the direction is vertical
     */
    isVertical: (rotation: GD8Symmetry) => boolean;
    /**
     * Approximates the vector `V(dx,dy)` into one of the
     * eight directions provided by `groupD8`.
     * @memberof PIXI.groupD8
     * @param {number} dx - X-component of the vector
     * @param {number} dy - Y-component of the vector
     * @returns {PIXI.GD8Symmetry} Approximation of the vector into
     *  one of the eight symmetries.
     */
    byDirection: (dx: number, dy: number) => GD8Symmetry;
    /**
     * Helps sprite to compensate texture packer rotation.
     * @memberof PIXI.groupD8
     * @param {PIXI.Matrix} matrix - sprite world matrix
     * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
     * @param {number} tx - sprite anchoring
     * @param {number} ty - sprite anchoring
     */
    matrixAppendRotationInv: (matrix: Matrix, rotation: GD8Symmetry, tx?: number, ty?: number) => void;
};

export declare interface IPoint extends IPointData {
    copyFrom(p: IPointData): this;
    copyTo<T extends IPoint>(p: T): T;
    equals(p: IPointData): boolean;
    set(x?: number, y?: number): void;
}

export declare interface IPointData extends GlobalMixins.IPointData {
    x: number;
    y: number;
}

export declare type IShape = Circle | Ellipse | Polygon | Rectangle | RoundedRectangle;

export declare interface ISize {
    width: number;
    height: number;
}

/**
 * The PixiJS Matrix as a class makes it a lot faster.
 *
 * Here is a representation of it:
 * ```js
 * | a | c | tx|
 * | b | d | ty|
 * | 0 | 0 | 1 |
 * ```
 * @memberof PIXI
 */
export declare class Matrix {
    /** @default 1 */
    a: number;
    /** @default 0 */
    b: number;
    /** @default 0 */
    c: number;
    /** @default 1 */
    d: number;
    /** @default 0 */
    tx: number;
    /** @default 0 */
    ty: number;
    array: Float32Array | null;
    /**
     * @param a - x scale
     * @param b - y skew
     * @param c - x skew
     * @param d - y scale
     * @param tx - x translation
     * @param ty - y translation
     */
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
     *
     * a = array[0]
     * b = array[1]
     * c = array[3]
     * d = array[4]
     * tx = array[2]
     * ty = array[5]
     * @param array - The array that the matrix will be populated from.
     */
    fromArray(array: number[]): void;
    /**
     * Sets the matrix properties.
     * @param a - Matrix component
     * @param b - Matrix component
     * @param c - Matrix component
     * @param d - Matrix component
     * @param tx - Matrix component
     * @param ty - Matrix component
     * @returns This matrix. Good for chaining method calls.
     */
    set(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
    /**
     * Creates an array from the current Matrix object.
     * @param transpose - Whether we need to transpose the matrix or not
     * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
     * @returns The newly created array which contains the matrix
     */
    toArray(transpose: boolean, out?: Float32Array): Float32Array;
    /**
     * Get a new position with the current transformation applied.
     * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
     * @param pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @returns {PIXI.Point} The new point, transformed through this matrix
     */
    apply<P extends IPointData = Point>(pos: IPointData, newPos?: P): P;
    /**
     * Get a new position with the inverse of the current transformation applied.
     * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
     * @param pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @returns {PIXI.Point} The new point, inverse-transformed through this matrix
     */
    applyInverse<P extends IPointData = Point>(pos: IPointData, newPos?: P): P;
    /**
     * Translates the matrix on the x and y.
     * @param x - How much to translate x by
     * @param y - How much to translate y by
     * @returns This matrix. Good for chaining method calls.
     */
    translate(x: number, y: number): this;
    /**
     * Applies a scale transformation to the matrix.
     * @param x - The amount to scale horizontally
     * @param y - The amount to scale vertically
     * @returns This matrix. Good for chaining method calls.
     */
    scale(x: number, y: number): this;
    /**
     * Applies a rotation transformation to the matrix.
     * @param angle - The angle in radians.
     * @returns This matrix. Good for chaining method calls.
     */
    rotate(angle: number): this;
    /**
     * Appends the given Matrix to this Matrix.
     * @param matrix - The matrix to append.
     * @returns This matrix. Good for chaining method calls.
     */
    append(matrix: Matrix): this;
    /**
     * Sets the matrix based on all the available properties
     * @param x - Position on the x axis
     * @param y - Position on the y axis
     * @param pivotX - Pivot on the x axis
     * @param pivotY - Pivot on the y axis
     * @param scaleX - Scale on the x axis
     * @param scaleY - Scale on the y axis
     * @param rotation - Rotation in radians
     * @param skewX - Skew on the x axis
     * @param skewY - Skew on the y axis
     * @returns This matrix. Good for chaining method calls.
     */
    setTransform(x: number, y: number, pivotX: number, pivotY: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number): this;
    /**
     * Prepends the given Matrix to this Matrix.
     * @param matrix - The matrix to prepend
     * @returns This matrix. Good for chaining method calls.
     */
    prepend(matrix: Matrix): this;
    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     * @param transform - The transform to apply the properties to.
     * @returns The transform with the newly applied properties
     */
    decompose(transform: Transform): Transform;
    /**
     * Inverts this matrix
     * @returns This matrix. Good for chaining method calls.
     */
    invert(): this;
    /**
     * Resets this Matrix to an identity (default) matrix.
     * @returns This matrix. Good for chaining method calls.
     */
    identity(): this;
    /**
     * Creates a new Matrix object with the same values as this one.
     * @returns A copy of this matrix. Good for chaining method calls.
     */
    clone(): Matrix;
    /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     * @param matrix - The matrix to copy to.
     * @returns The matrix given in parameter with its values updated.
     */
    copyTo(matrix: Matrix): Matrix;
    /**
     * Changes the values of the matrix to be the same as the ones in given matrix
     * @param {PIXI.Matrix} matrix - The matrix to copy from.
     * @returns {PIXI.Matrix} this
     */
    copyFrom(matrix: Matrix): this;
    toString(): string;
    /**
     * A default (identity) matrix
     * @readonly
     */
    static get IDENTITY(): Matrix;
    /**
     * A temp matrix
     * @readonly
     */
    static get TEMP_MATRIX(): Matrix;
}

export declare interface ObservablePoint extends GlobalMixins.Point, IPoint {
}

/**
 * The ObservablePoint object represents a location in a two-dimensional coordinate system, where `x` represents
 * the position on the horizontal axis and `y` represents the position on the vertical axis.
 *
 * An `ObservablePoint` is a point that triggers a callback when the point's position is changed.
 * @memberof PIXI
 */
export declare class ObservablePoint<T = any> implements IPoint {
    /** The callback function triggered when `x` and/or `y` are changed */
    cb: (this: T) => any;
    /** The owner of the callback */
    scope: any;
    _x: number;
    _y: number;
    /**
     * Creates a new `ObservablePoint`
     * @param cb - callback function triggered when `x` and/or `y` are changed
     * @param scope - owner of callback
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    constructor(cb: (this: T) => any, scope: T, x?: number, y?: number);
    /**
     * Creates a clone of this point.
     * The callback and scope params can be overridden otherwise they will default
     * to the clone object's values.
     * @override
     * @param cb - The callback function triggered when `x` and/or `y` are changed
     * @param scope - The owner of the callback
     * @returns a copy of this observable point
     */
    clone(cb?: (this: T) => any, scope?: any): ObservablePoint;
    /**
     * Sets the point to a new `x` and `y` position.
     * If `y` is omitted, both `x` and `y` will be set to `x`.
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=x] - position of the point on the y axis
     * @returns The observable point instance itself
     */
    set(x?: number, y?: number): this;
    /**
     * Copies x and y from the given point (`p`)
     * @param p - The point to copy from. Can be any of type that is or extends `IPointData`
     * @returns The observable point instance itself
     */
    copyFrom(p: IPointData): this;
    /**
     * Copies this point's x and y into that of the given point (`p`)
     * @param p - The point to copy to. Can be any of type that is or extends `IPointData`
     * @returns The point (`p`) with values updated
     */
    copyTo<T extends IPoint>(p: T): T;
    /**
     * Accepts another point (`p`) and returns `true` if the given point is equal to this point
     * @param p - The point to check
     * @returns Returns `true` if both `x` and `y` are equal
     */
    equals(p: IPointData): boolean;
    toString(): string;
    /** Position of the observable point on the x axis. */
    get x(): number;
    set x(value: number);
    /** Position of the observable point on the y axis. */
    get y(): number;
    set y(value: number);
}

/**
 * Two Pi.
 * @static
 * @member {number}
 * @memberof PIXI
 */
export declare const PI_2: number;

export declare interface Point extends GlobalMixins.Point, IPoint {
}

/**
 * The Point object represents a location in a two-dimensional coordinate system, where `x` represents
 * the position on the horizontal axis and `y` represents the position on the vertical axis
 * @class
 * @memberof PIXI
 * @implements {IPoint}
 */
export declare class Point implements IPoint {
    /** Position of the point on the x axis */
    x: number;
    /** Position of the point on the y axis */
    y: number;
    /**
     * Creates a new `Point`
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    constructor(x?: number, y?: number);
    /**
     * Creates a clone of this point
     * @returns A clone of this point
     */
    clone(): Point;
    /**
     * Copies `x` and `y` from the given point into this point
     * @param p - The point to copy from
     * @returns The point instance itself
     */
    copyFrom(p: IPointData): this;
    /**
     * Copies this point's x and y into the given point (`p`).
     * @param p - The point to copy to. Can be any of type that is or extends `IPointData`
     * @returns The point (`p`) with values updated
     */
    copyTo<T extends IPoint>(p: T): T;
    /**
     * Accepts another point (`p`) and returns `true` if the given point is equal to this point
     * @param p - The point to check
     * @returns Returns `true` if both `x` and `y` are equal
     */
    equals(p: IPointData): boolean;
    /**
     * Sets the point to a new `x` and `y` position.
     * If `y` is omitted, both `x` and `y` will be set to `x`.
     * @param {number} [x=0] - position of the point on the `x` axis
     * @param {number} [y=x] - position of the point on the `y` axis
     * @returns The point instance itself
     */
    set(x?: number, y?: number): this;
    toString(): string;
}

/**
 * A class to define a shape via user defined coordinates.
 * @memberof PIXI
 */
export declare class Polygon {
    /** An array of the points of this polygon. */
    points: number[];
    /** `false` after moveTo, `true` after `closePath`. In all other cases it is `true`. */
    closeStroke: boolean;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default PIXI.SHAPES.POLY
     * @see PIXI.SHAPES
     */
    readonly type: SHAPES.POLY;
    constructor(points: IPointData[] | number[]);
    constructor(...points: IPointData[] | number[]);
    /**
     * Creates a clone of this polygon.
     * @returns - A copy of the polygon.
     */
    clone(): Polygon;
    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon.
     * @param x - The X coordinate of the point to test.
     * @param y - The Y coordinate of the point to test.
     * @returns - Whether the x/y coordinates are within this polygon.
     */
    contains(x: number, y: number): boolean;
    toString(): string;
}

/**
 * Conversion factor for converting radians to degrees.
 * @static
 * @member {number} RAD_TO_DEG
 * @memberof PIXI
 */
export declare const RAD_TO_DEG: number;

export declare interface Rectangle extends GlobalMixins.Rectangle {
}

/**
 * Size object, contains width and height
 * @memberof PIXI
 * @typedef {object} ISize@typedef {object} ISize
 * @property {number} width - Width component
 * @property {number} height - Height component
 */
/**
 * Rectangle object is an area defined by its position, as indicated by its top-left corner
 * point (x, y) and by its width and its height.
 * @memberof PIXI
 */
export declare class Rectangle {
    /** @default 0 */
    x: number;
    /** @default 0 */
    y: number;
    /** @default 0 */
    width: number;
    /** @default 0 */
    height: number;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default PIXI.SHAPES.RECT
     * @see PIXI.SHAPES
     */
    readonly type: SHAPES.RECT;
    /**
     * @param x - The X coordinate of the upper-left corner of the rectangle
     * @param y - The Y coordinate of the upper-left corner of the rectangle
     * @param width - The overall width of the rectangle
     * @param height - The overall height of the rectangle
     */
    constructor(x?: string | number, y?: string | number, width?: string | number, height?: string | number);
    /** Returns the left edge of the rectangle. */
    get left(): number;
    /** Returns the right edge of the rectangle. */
    get right(): number;
    /** Returns the top edge of the rectangle. */
    get top(): number;
    /** Returns the bottom edge of the rectangle. */
    get bottom(): number;
    /** A constant empty rectangle. */
    static get EMPTY(): Rectangle;
    /**
     * Creates a clone of this Rectangle
     * @returns a copy of the rectangle
     */
    clone(): Rectangle;
    /**
     * Copies another rectangle to this one.
     * @param rectangle - The rectangle to copy from.
     * @returns Returns itself.
     */
    copyFrom(rectangle: Rectangle): Rectangle;
    /**
     * Copies this rectangle to another one.
     * @param rectangle - The rectangle to copy to.
     * @returns Returns given parameter.
     */
    copyTo(rectangle: Rectangle): Rectangle;
    /**
     * Checks whether the x and y coordinates given are contained within this Rectangle
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @returns Whether the x/y coordinates are within this Rectangle
     */
    contains(x: number, y: number): boolean;
    /**
     * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
     * Returns true only if the area of the intersection is >0, this means that Rectangles
     * sharing a side are not overlapping. Another side effect is that an arealess rectangle
     * (width or height equal to zero) can't intersect any other rectangle.
     * @param {Rectangle} other - The Rectangle to intersect with `this`.
     * @param {Matrix} transform - The transformation matrix of `other`.
     * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
     */
    intersects(other: Rectangle, transform?: Matrix): boolean;
    /**
     * Pads the rectangle making it grow in all directions.
     * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
     * @param paddingX - The horizontal padding amount.
     * @param paddingY - The vertical padding amount.
     * @returns Returns itself.
     */
    pad(paddingX?: number, paddingY?: number): this;
    /**
     * Fits this rectangle around the passed one.
     * @param rectangle - The rectangle to fit.
     * @returns Returns itself.
     */
    fit(rectangle: Rectangle): this;
    /**
     * Enlarges rectangle that way its corners lie on grid
     * @param resolution - resolution
     * @param eps - precision
     * @returns Returns itself.
     */
    ceil(resolution?: number, eps?: number): this;
    /**
     * Enlarges this rectangle to include the passed rectangle.
     * @param rectangle - The rectangle to include.
     * @returns Returns itself.
     */
    enlarge(rectangle: Rectangle): this;
    toString(): string;
}

/**
 * The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
 * top-left corner point (x, y) and by its width and its height and its radius.
 * @memberof PIXI
 */
export declare class RoundedRectangle {
    /** @default 0 */
    x: number;
    /** @default 0 */
    y: number;
    /** @default 0 */
    width: number;
    /** @default 0 */
    height: number;
    /** @default 20 */
    radius: number;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default PIXI.SHAPES.RREC
     * @see PIXI.SHAPES
     */
    readonly type: SHAPES.RREC;
    /**
     * @param x - The X coordinate of the upper-left corner of the rounded rectangle
     * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
     * @param width - The overall width of this rounded rectangle
     * @param height - The overall height of this rounded rectangle
     * @param radius - Controls the radius of the rounded corners
     */
    constructor(x?: number, y?: number, width?: number, height?: number, radius?: number);
    /**
     * Creates a clone of this Rounded Rectangle.
     * @returns - A copy of the rounded rectangle.
     */
    clone(): RoundedRectangle;
    /**
     * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
     * @param x - The X coordinate of the point to test.
     * @param y - The Y coordinate of the point to test.
     * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
     */
    contains(x: number, y: number): boolean;
    toString(): string;
}

/**
 * Constants that identify shapes, mainly to prevent `instanceof` calls.
 * @static
 * @memberof PIXI
 * @enum {number}
 * @property {number} POLY Polygon
 * @property {number} RECT Rectangle
 * @property {number} CIRC Circle
 * @property {number} ELIP Ellipse
 * @property {number} RREC Rounded Rectangle
 */
export declare enum SHAPES {
    POLY = 0,
    RECT = 1,
    CIRC = 2,
    ELIP = 3,
    RREC = 4
}

export declare interface Transform extends GlobalMixins.Transform {
}

/**
 * Transform that takes care about its versions.
 * @memberof PIXI
 */
export declare class Transform {
    /** A default (identity) transform. */
    static readonly IDENTITY: Transform;
    /** The world transformation matrix. */
    worldTransform: Matrix;
    /** The local transformation matrix. */
    localTransform: Matrix;
    /** The coordinate of the object relative to the local coordinates of the parent. */
    position: ObservablePoint;
    /** The scale factor of the object. */
    scale: ObservablePoint;
    /** The pivot point of the displayObject that it rotates around. */
    pivot: ObservablePoint;
    /** The skew amount, on the x and y axis. */
    skew: ObservablePoint;
    /** The locally unique ID of the parent's world transform used to calculate the current world transformation matrix. */
    _parentID: number;
    /** The locally unique ID of the world transform. */
    _worldID: number;
    /** The rotation amount. */
    protected _rotation: number;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _cx: number;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _sx: number;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _cy: number;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _sy: number;
    /** The locally unique ID of the local transform. */
    protected _localID: number;
    /** The locally unique ID of the local transform used to calculate the current local transformation matrix. */
    protected _currentLocalID: number;
    constructor();
    /** Called when a value changes. */
    protected onChange(): void;
    /** Called when the skew or the rotation changes. */
    protected updateSkew(): void;
    toString(): string;
    /** Updates the local transformation matrix. */
    updateLocalTransform(): void;
    /**
     * Updates the local and the world transformation matrices.
     * @param parentTransform - The parent transform
     */
    updateTransform(parentTransform: Transform): void;
    /**
     * Decomposes a matrix and sets the transforms properties based on it.
     * @param matrix - The matrix to decompose
     */
    setFromMatrix(matrix: Matrix): void;
    /** The rotation of the object in radians. */
    get rotation(): number;
    set rotation(value: number);
}

export { }
