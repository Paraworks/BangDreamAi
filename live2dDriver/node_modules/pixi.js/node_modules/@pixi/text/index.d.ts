import type { IDestroyOptions } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import type { Renderer } from '@pixi/core';
import { Sprite } from '@pixi/sprite';

declare interface IFontMetrics {
    ascent: number;
    descent: number;
    fontSize: number;
}

export declare interface ITextStyle {
    align: TextStyleAlign;
    breakWords: boolean;
    dropShadow: boolean;
    dropShadowAlpha: number;
    dropShadowAngle: number;
    dropShadowBlur: number;
    dropShadowColor: string | number;
    dropShadowDistance: number;
    fill: TextStyleFill;
    fillGradientType: TEXT_GRADIENT;
    fillGradientStops: number[];
    fontFamily: string | string[];
    fontSize: number | string;
    fontStyle: TextStyleFontStyle;
    fontVariant: TextStyleFontVariant;
    fontWeight: TextStyleFontWeight;
    letterSpacing: number;
    lineHeight: number;
    lineJoin: TextStyleLineJoin;
    miterLimit: number;
    padding: number;
    stroke: string | number;
    strokeThickness: number;
    textBaseline: TextStyleTextBaseline;
    trim: boolean;
    whiteSpace: TextStyleWhiteSpace;
    wordWrap: boolean;
    wordWrapWidth: number;
    leading: number;
}

declare interface ModernContext2D extends CanvasRenderingContext2D {
    textLetterSpacing?: number;
    letterSpacing?: number;
}

/**
 * A Text Object will create a line or multiple lines of text.
 *
 * The text is created using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
 *
 * The primary advantage of this class over BitmapText is that you have great control over the style of the text,
 * which you can change at runtime.
 *
 * The primary disadvantages is that each piece of text has it's own texture, which can use more memory.
 * When text changes, this texture has to be re-generated and re-uploaded to the GPU, taking up time.
 *
 * To split a line you can use '\n' in your text string, or, on the `style` object,
 * change its `wordWrap` property to true and and give the `wordWrapWidth` property a value.
 *
 * A Text can be created directly from a string and a style object,
 * which can be generated [here](https://pixijs.io/pixi-text-style).
 *
 * ```js
 * let text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
 * ```
 * @memberof PIXI
 */
declare class Text_2 extends Sprite {
    /**
     * New behavior for `lineHeight` that's meant to mimic HTML text. A value of `true` will
     * make sure the first baseline is offset by the `lineHeight` value if it is greater than `fontSize`.
     * A value of `false` will use the legacy behavior and not change the baseline of the first line.
     * In the next major release, we'll enable this by default.
     */
    static nextLineHeightBehavior: boolean;
    /**
     * New rendering behavior for letter-spacing which uses Chrome's new native API. This will
     * lead to more accurate letter-spacing results because it does not try to manually draw
     * each character. However, this Chrome API is experimental and may not serve all cases yet.
     */
    static experimentalLetterSpacing: boolean;
    /** The canvas element that everything is drawn to. */
    canvas: HTMLCanvasElement;
    /** The canvas 2d context that everything is drawn with. */
    context: ModernContext2D;
    localStyleID: number;
    dirty: boolean;
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default PIXI.settings.RESOLUTION
     */
    _resolution: number;
    _autoResolution: boolean;
    /**
     * Private tracker for the current text.
     * @private
     */
    protected _text: string;
    /**
     * Private tracker for the current font.
     * @private
     */
    protected _font: string;
    /**
     * Private tracker for the current style.
     * @private
     */
    protected _style: TextStyle;
    /**
     * Private listener to track style changes.
     * @private
     */
    protected _styleListener: () => void;
    /**
     * Keep track if this Text object created it's own canvas
     * element (`true`) or uses the constructor argument (`false`).
     * Used to workaround a GC issues with Safari < 13 when
     * destroying Text. See `destroy` for more info.
     */
    private _ownCanvas;
    /**
     * @param text - The string that you would like the text to display
     * @param {object|PIXI.TextStyle} [style] - The style parameters
     * @param canvas - The canvas element for drawing text
     */
    constructor(text?: string | number, style?: Partial<ITextStyle> | TextStyle, canvas?: HTMLCanvasElement);
    /**
     * Renders text to its canvas, and updates its texture.
     *
     * By default this is used internally to ensure the texture is correct before rendering,
     * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
     * and then shared across multiple Sprites.
     * @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
     */
    updateText(respectDirty: boolean): void;
    /**
     * Render the text with letter-spacing.
     * @param text - The text to draw
     * @param x - Horizontal position to draw the text
     * @param y - Vertical position to draw the text
     * @param isStroke - Is this drawing for the outside stroke of the
     *  text? If not, it's for the inside fill
     */
    private drawLetterSpacing;
    /** Updates texture size based on canvas size. */
    private updateTexture;
    /**
     * Renders the object using the WebGL renderer
     * @param renderer - The renderer
     */
    protected _render(renderer: Renderer): void;
    /** Updates the transform on all children of this container for rendering. */
    updateTransform(): void;
    getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
    /**
     * Gets the local bounds of the text object.
     * @param rect - The output rectangle.
     * @returns The bounds.
     */
    getLocalBounds(rect?: Rectangle): Rectangle;
    /** Calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account. */
    protected _calculateBounds(): void;
    /**
     * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
     * @param style - The style.
     * @param lines - The lines of text.
     * @param metrics
     * @returns The fill style
     */
    private _generateFillStyle;
    /**
     * Destroys this text object.
     *
     * Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
     * the majority of the time the texture will not be shared with any other Sprites.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their
     *  destroy method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
     * @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
     */
    destroy(options?: IDestroyOptions | boolean): void;
    /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
    get width(): number;
    set width(value: number);
    /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
    get height(): number;
    set height(value: number);
    /**
     * Set the style of the text.
     *
     * Set up an event listener to listen for changes on the style object and mark the text as dirty.
     */
    get style(): TextStyle | Partial<ITextStyle>;
    set style(style: TextStyle | Partial<ITextStyle>);
    /** Set the copy for the text object. To split a line you can use '\n'. */
    get text(): string;
    set text(text: string | number);
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default 1
     */
    get resolution(): number;
    set resolution(value: number);
}
export { Text_2 as Text }

/**
 * Constants that define the type of gradient on text.
 * @static
 * @constant
 * @name TEXT_GRADIENT
 * @memberof PIXI
 * @type {object}
 * @property {number} LINEAR_VERTICAL Vertical gradient
 * @property {number} LINEAR_HORIZONTAL Linear gradient
 */
export declare enum TEXT_GRADIENT {
    LINEAR_VERTICAL = 0,
    LINEAR_HORIZONTAL = 1
}

/**
 * The TextMetrics object represents the measurement of a block of text with a specified style.
 *
 * ```js
 * let style = new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'})
 * let textMetrics = PIXI.TextMetrics.measureText('Your text', style)
 * ```
 * @memberof PIXI
 */
declare class TextMetrics_2 {
    /** The text that was measured. */
    text: string;
    /** The style that was measured. */
    style: TextStyle;
    /** The measured width of the text. */
    width: number;
    /** The measured height of the text. */
    height: number;
    /** An array of lines of the text broken by new lines and wrapping is specified in style. */
    lines: string[];
    /** An array of the line widths for each line matched to `lines`. */
    lineWidths: number[];
    /** The measured line height for this style. */
    lineHeight: number;
    /** The maximum line width for all measured lines. */
    maxLineWidth: number;
    /**
     * The font properties object from TextMetrics.measureFont.
     * @type {PIXI.IFontMetrics}
     */
    fontProperties: IFontMetrics;
    static METRICS_STRING: string;
    static BASELINE_SYMBOL: string;
    static BASELINE_MULTIPLIER: number;
    static HEIGHT_MULTIPLIER: number;
    private static __canvas;
    private static __context;
    static _fonts: {
        [font: string]: IFontMetrics;
    };
    static _newlines: number[];
    static _breakingSpaces: number[];
    /**
     * @param text - the text that was measured
     * @param style - the style that was measured
     * @param width - the measured width of the text
     * @param height - the measured height of the text
     * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
     * @param lineWidths - an array of the line widths for each line matched to `lines`
     * @param lineHeight - the measured line height for this style
     * @param maxLineWidth - the maximum line width for all measured lines
     * @param {PIXI.IFontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
     */
    constructor(text: string, style: TextStyle, width: number, height: number, lines: string[], lineWidths: number[], lineHeight: number, maxLineWidth: number, fontProperties: IFontMetrics);
    /**
     * Measures the supplied string of text and returns a Rectangle.
     * @param text - The text to measure.
     * @param style - The text style to use for measuring
     * @param wordWrap - Override for if word-wrap should be applied to the text.
     * @param canvas - optional specification of the canvas to use for measuring.
     * @returns Measured width and height of the text.
     */
    static measureText(text: string, style: TextStyle, wordWrap?: boolean, canvas?: HTMLCanvasElement | OffscreenCanvas): TextMetrics_2;
    /**
     * Applies newlines to a string to have it optimally fit into the horizontal
     * bounds set by the Text object's wordWrapWidth property.
     * @param text - String to apply word wrapping to
     * @param style - the style to use when wrapping
     * @param canvas - optional specification of the canvas to use for measuring.
     * @returns New string with new lines applied where required
     */
    private static wordWrap;
    /**
     * Convienience function for logging each line added during the wordWrap method.
     * @param line    - The line of text to add
     * @param newLine - Add new line character to end
     * @returns A formatted line
     */
    private static addLine;
    /**
     * Gets & sets the widths of calculated characters in a cache object
     * @param key            - The key
     * @param letterSpacing  - The letter spacing
     * @param cache          - The cache
     * @param context        - The canvas context
     * @returns The from cache.
     */
    private static getFromCache;
    /**
     * Determines whether we should collapse breaking spaces.
     * @param whiteSpace - The TextStyle property whiteSpace
     * @returns Should collapse
     */
    private static collapseSpaces;
    /**
     * Determines whether we should collapse newLine chars.
     * @param whiteSpace - The white space
     * @returns  should collapse
     */
    private static collapseNewlines;
    /**
     * Trims breaking whitespaces from string.
     * @param  text - The text
     * @returns Trimmed string
     */
    private static trimRight;
    /**
     * Determines if char is a newline.
     * @param  char - The character
     * @returns True if newline, False otherwise.
     */
    private static isNewline;
    /**
     * Determines if char is a breaking whitespace.
     *
     * It allows one to determine whether char should be a breaking whitespace
     * For example certain characters in CJK langs or numbers.
     * It must return a boolean.
     * @param char - The character
     * @param [_nextChar] - The next character
     * @returns True if whitespace, False otherwise.
     */
    static isBreakingSpace(char: string, _nextChar?: string): boolean;
    /**
     * Splits a string into words, breaking-spaces and newLine characters
     * @param  text - The text
     * @returns  A tokenized array
     */
    private static tokenize;
    /**
     * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
     *
     * It allows one to customise which words should break
     * Examples are if the token is CJK or numbers.
     * It must return a boolean.
     * @param _token - The token
     * @param  breakWords - The style attr break words
     * @returns Whether to break word or not
     */
    static canBreakWords(_token: string, breakWords: boolean): boolean;
    /**
     * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
     *
     * It allows one to determine whether a pair of characters
     * should be broken by newlines
     * For example certain characters in CJK langs or numbers.
     * It must return a boolean.
     * @param _char - The character
     * @param _nextChar - The next character
     * @param _token - The token/word the characters are from
     * @param _index - The index in the token of the char
     * @param _breakWords - The style attr break words
     * @returns whether to break word or not
     */
    static canBreakChars(_char: string, _nextChar: string, _token: string, _index: number, _breakWords: boolean): boolean;
    /**
     * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
     *
     * It is called when a token (usually a word) has to be split into separate pieces
     * in order to determine the point to break a word.
     * It must return an array of characters.
     * @example
     * // Correctly splits emojis, eg "🤪🤪" will result in two element array, each with one emoji.
     * TextMetrics.wordWrapSplit = (token) => [...token];
     * @param  token - The token to split
     * @returns The characters of the token
     */
    static wordWrapSplit(token: string): string[];
    /**
     * Calculates the ascent, descent and fontSize of a given font-style
     * @param font - String representing the style of the font
     * @returns Font properties object
     */
    static measureFont(font: string): IFontMetrics;
    /**
     * Clear font metrics in metrics cache.
     * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
     */
    static clearMetrics(font?: string): void;
    /**
     * Cached canvas element for measuring text
     * TODO: this should be private, but isn't because of backward compat, will fix later.
     * @ignore
     */
    static get _canvas(): HTMLCanvasElement | OffscreenCanvas;
    /**
     * TODO: this should be private, but isn't because of backward compat, will fix later.
     * @ignore
     */
    static get _context(): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
}
export { TextMetrics_2 as TextMetrics }

/**
 * A TextStyle Object contains information to decorate a Text objects.
 *
 * An instance can be shared between multiple Text objects; then changing the style will update all text objects using it.
 *
 * A tool can be used to generate a text style [here](https://pixijs.io/pixi-text-style).
 *
 * @memberof PIXI
 */
export declare class TextStyle implements ITextStyle {
    styleID: number;
    protected _align: TextStyleAlign;
    protected _breakWords: boolean;
    protected _dropShadow: boolean;
    protected _dropShadowAlpha: number;
    protected _dropShadowAngle: number;
    protected _dropShadowBlur: number;
    protected _dropShadowColor: string | number;
    protected _dropShadowDistance: number;
    protected _fill: TextStyleFill;
    protected _fillGradientType: TEXT_GRADIENT;
    protected _fillGradientStops: number[];
    protected _fontFamily: string | string[];
    protected _fontSize: number | string;
    protected _fontStyle: TextStyleFontStyle;
    protected _fontVariant: TextStyleFontVariant;
    protected _fontWeight: TextStyleFontWeight;
    protected _letterSpacing: number;
    protected _lineHeight: number;
    protected _lineJoin: TextStyleLineJoin;
    protected _miterLimit: number;
    protected _padding: number;
    protected _stroke: string | number;
    protected _strokeThickness: number;
    protected _textBaseline: TextStyleTextBaseline;
    protected _trim: boolean;
    protected _whiteSpace: TextStyleWhiteSpace;
    protected _wordWrap: boolean;
    protected _wordWrapWidth: number;
    protected _leading: number;
    /**
     * @param {object} [style] - The style parameters
     * @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center' or 'right'),
     *  does not affect single line text
     * @param {boolean} [style.breakWords=false] - Indicates if lines can be wrapped within words, it
     *  needs wordWrap to be set to true
     * @param {boolean} [style.dropShadow=false] - Set a drop shadow for the text
     * @param {number} [style.dropShadowAlpha=1] - Set alpha for the drop shadow
     * @param {number} [style.dropShadowAngle=Math.PI/6] - Set a angle of the drop shadow
     * @param {number} [style.dropShadowBlur=0] - Set a shadow blur radius
     * @param {string|number} [style.dropShadowColor='black'] - A fill style to be used on the dropshadow e.g 'red', '#00FF00'
     * @param {number} [style.dropShadowDistance=5] - Set a distance of the drop shadow
     * @param {string|string[]|number|number[]|CanvasGradient|CanvasPattern} [style.fill='black'] - A canvas
     *  fillstyle that will be used on the text e.g 'red', '#00FF00'. Can be an array to create a gradient
     *  eg ['#000000','#FFFFFF']
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     * @param {number} [style.fillGradientType=PIXI.TEXT_GRADIENT.LINEAR_VERTICAL] - If fill is an array of colours
     *  to create a gradient, this can change the type/direction of the gradient. See {@link PIXI.TEXT_GRADIENT}
     * @param {number[]} [style.fillGradientStops] - If fill is an array of colours to create a gradient, this array can set
     * the stop points (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
     * @param {string|string[]} [style.fontFamily='Arial'] - The font family
     * @param {number|string} [style.fontSize=26] - The font size (as a number it converts to px, but as a string,
     *  equivalents are '26px','20pt','160%' or '1.6em')
     * @param {string} [style.fontStyle='normal'] - The font style ('normal', 'italic' or 'oblique')
     * @param {string} [style.fontVariant='normal'] - The font variant ('normal' or 'small-caps')
     * @param {string} [style.fontWeight='normal'] - The font weight ('normal', 'bold', 'bolder', 'lighter' and '100',
     *  '200', '300', '400', '500', '600', '700', '800' or '900')
     * @param {number} [style.leading=0] - The space between lines
     * @param {number} [style.letterSpacing=0] - The amount of spacing between letters, default is 0
     * @param {number} [style.lineHeight] - The line height, a number that represents the vertical space that a letter uses
     * @param {string} [style.lineJoin='miter'] - The lineJoin property sets the type of corner created, it can resolve
     *      spiked text issues. Possible values "miter" (creates a sharp corner), "round" (creates a round corner) or "bevel"
     *      (creates a squared corner).
     * @param {number} [style.miterLimit=10] - The miter limit to use when using the 'miter' lineJoin mode. This can reduce
     *      or increase the spikiness of rendered text.
     * @param {number} [style.padding=0] - Occasionally some fonts are cropped. Adding some padding will prevent this from
     *     happening by adding padding to all sides of the text.
     * @param {string|number} [style.stroke='black'] - A canvas fillstyle that will be used on the text stroke
     *  e.g 'blue', '#FCFF00'
     * @param {number} [style.strokeThickness=0] - A number that represents the thickness of the stroke.
     *  Default is 0 (no stroke)
     * @param {boolean} [style.trim=false] - Trim transparent borders
     * @param {string} [style.textBaseline='alphabetic'] - The baseline of the text that is rendered.
     * @param {string} [style.whiteSpace='pre'] - Determines whether newlines & spaces are collapsed or preserved "normal"
     *      (collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve, collapse). It needs wordWrap to be set to true
     * @param {boolean} [style.wordWrap=false] - Indicates if word wrap should be used
     * @param {number} [style.wordWrapWidth=100] - The width at which text will wrap, it needs wordWrap to be set to true
     */
    constructor(style?: Partial<ITextStyle>);
    /**
     * Creates a new TextStyle object with the same values as this one.
     * Note that the only the properties of the object are cloned.
     *
     * @return New cloned TextStyle object
     */
    clone(): TextStyle;
    /** Resets all properties to the defaults specified in TextStyle.prototype._default */
    reset(): void;
    /**
     * Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
     *
     * @member {string}
     */
    get align(): TextStyleAlign;
    set align(align: TextStyleAlign);
    /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
    get breakWords(): boolean;
    set breakWords(breakWords: boolean);
    /** Set a drop shadow for the text. */
    get dropShadow(): boolean;
    set dropShadow(dropShadow: boolean);
    /** Set alpha for the drop shadow. */
    get dropShadowAlpha(): number;
    set dropShadowAlpha(dropShadowAlpha: number);
    /** Set a angle of the drop shadow. */
    get dropShadowAngle(): number;
    set dropShadowAngle(dropShadowAngle: number);
    /** Set a shadow blur radius. */
    get dropShadowBlur(): number;
    set dropShadowBlur(dropShadowBlur: number);
    /** A fill style to be used on the dropshadow e.g 'red', '#00FF00'. */
    get dropShadowColor(): number | string;
    set dropShadowColor(dropShadowColor: number | string);
    /** Set a distance of the drop shadow. */
    get dropShadowDistance(): number;
    set dropShadowDistance(dropShadowDistance: number);
    /**
     * A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
     *
     * Can be an array to create a gradient eg ['#000000','#FFFFFF']
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     *
     * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
     */
    get fill(): TextStyleFill;
    set fill(fill: TextStyleFill);
    /**
     * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
     *
     * @see PIXI.TEXT_GRADIENT
     */
    get fillGradientType(): TEXT_GRADIENT;
    set fillGradientType(fillGradientType: TEXT_GRADIENT);
    /**
     * If fill is an array of colours to create a gradient, this array can set the stop points
     * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
     */
    get fillGradientStops(): number[];
    set fillGradientStops(fillGradientStops: number[]);
    /** The font family. */
    get fontFamily(): string | string[];
    set fontFamily(fontFamily: string | string[]);
    /**
     * The font size
     * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
     */
    get fontSize(): number | string;
    set fontSize(fontSize: number | string);
    /**
     * The font style
     * ('normal', 'italic' or 'oblique')
     *
     * @member {string}
     */
    get fontStyle(): TextStyleFontStyle;
    set fontStyle(fontStyle: TextStyleFontStyle);
    /**
     * The font variant
     * ('normal' or 'small-caps')
     *
     * @member {string}
     */
    get fontVariant(): TextStyleFontVariant;
    set fontVariant(fontVariant: TextStyleFontVariant);
    /**
     * The font weight
     * ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
     *
     * @member {string}
     */
    get fontWeight(): TextStyleFontWeight;
    set fontWeight(fontWeight: TextStyleFontWeight);
    /** The amount of spacing between letters, default is 0. */
    get letterSpacing(): number;
    set letterSpacing(letterSpacing: number);
    /** The line height, a number that represents the vertical space that a letter uses. */
    get lineHeight(): number;
    set lineHeight(lineHeight: number);
    /** The space between lines. */
    get leading(): number;
    set leading(leading: number);
    /**
     * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
     * Default is 'miter' (creates a sharp corner).
     *
     * @member {string}
     */
    get lineJoin(): TextStyleLineJoin;
    set lineJoin(lineJoin: TextStyleLineJoin);
    /**
     * The miter limit to use when using the 'miter' lineJoin mode.
     *
     * This can reduce or increase the spikiness of rendered text.
     */
    get miterLimit(): number;
    set miterLimit(miterLimit: number);
    /**
     * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
     * by adding padding to all sides of the text.
     */
    get padding(): number;
    set padding(padding: number);
    /**
     * A canvas fillstyle that will be used on the text stroke
     * e.g 'blue', '#FCFF00'
     */
    get stroke(): string | number;
    set stroke(stroke: string | number);
    /**
     * A number that represents the thickness of the stroke.
     *
     * @default 0
     */
    get strokeThickness(): number;
    set strokeThickness(strokeThickness: number);
    /**
     * The baseline of the text that is rendered.
     *
     * @member {string}
     */
    get textBaseline(): TextStyleTextBaseline;
    set textBaseline(textBaseline: TextStyleTextBaseline);
    /** Trim transparent borders. */
    get trim(): boolean;
    set trim(trim: boolean);
    /**
     * How newlines and spaces should be handled.
     * Default is 'pre' (preserve, preserve).
     *
     *  value       | New lines     |   Spaces
     *  ---         | ---           |   ---
     * 'normal'     | Collapse      |   Collapse
     * 'pre'        | Preserve      |   Preserve
     * 'pre-line'   | Preserve      |   Collapse
     *
     * @member {string}
     */
    get whiteSpace(): TextStyleWhiteSpace;
    set whiteSpace(whiteSpace: TextStyleWhiteSpace);
    /** Indicates if word wrap should be used. */
    get wordWrap(): boolean;
    set wordWrap(wordWrap: boolean);
    /** The width at which text will wrap, it needs wordWrap to be set to true. */
    get wordWrapWidth(): number;
    set wordWrapWidth(wordWrapWidth: number);
    /**
     * Generates a font style string to use for `TextMetrics.measureFont()`.
     *
     * @return Font style string, for passing to `TextMetrics.measureFont()`
     */
    toFontString(): string;
}

export declare type TextStyleAlign = 'left' | 'center' | 'right' | 'justify';

export declare type TextStyleFill = string | string[] | number | number[] | CanvasGradient | CanvasPattern;

export declare type TextStyleFontStyle = 'normal' | 'italic' | 'oblique';

export declare type TextStyleFontVariant = 'normal' | 'small-caps';

export declare type TextStyleFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export declare type TextStyleLineJoin = 'miter' | 'round' | 'bevel';

export declare type TextStyleTextBaseline = 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom';

export declare type TextStyleWhiteSpace = 'normal' | 'pre' | 'pre-line';

export { }
