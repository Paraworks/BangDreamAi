/**
 * Strict extension format that is used internally for registrations.
 * @memberof PIXI
 */
export declare interface ExtensionFormat extends ExtensionFormatLoose {
    /** The extension type, always expressed as multiple, even if a single */
    type: ExtensionType[];
}

/**
 * Format when registering an extension. Generally, the extension
 * should have these values as `extension` static property,
 * but you can override name or type by providing an object.
 * @memberof PIXI
 */
export declare interface ExtensionFormatLoose {
    /** The extension type, can be multiple types */
    type: ExtensionType | ExtensionType[];
    /** Optional. Some plugins provide an API name/property, such as Renderer plugins */
    name?: string;
    /** Reference to the plugin object/class */
    ref: any;
}

export declare type ExtensionHandler = (extension: ExtensionFormat) => void;

export declare type ExtensionMetadata = ExtensionType | ExtensionMetadataDetails;

declare interface ExtensionMetadataDetails {
    type: ExtensionType | ExtensionType[];
    name?: string;
}

/**
 * Global registration of all PixiJS extensions. One-stop-shop for extensibility.
 * @memberof PIXI
 * @namespace extensions
 */
export declare const extensions: {
    /** @ignore */
    _addHandlers: Record<ExtensionType, ExtensionHandler>;
    /** @ignore */
    _removeHandlers: Record<ExtensionType, ExtensionHandler>;
    /** @ignore */
    _queue: Record<ExtensionType, ExtensionFormat[]>;
    /**
     * Remove extensions from PixiJS.
     * @param extensions - Extensions to be removed.
     * @returns {PIXI.extensions} For chaining.
     */
    remove(...extensions: Array<ExtensionFormatLoose | any>): any;
    /**
     * Register new extensions with PixiJS.
     * @param extensions - The spread of extensions to add to PixiJS.
     * @returns {PIXI.extensions} For chaining.
     */
    add(...extensions: Array<ExtensionFormatLoose | any>): any;
    /**
     * Internal method to handle extensions by name.
     * @param type - The extension type.
     * @param onAdd  - Function for handling when extensions are added/registered passes {@link PIXI.ExtensionFormat}.
     * @param onRemove  - Function for handling when extensions are removed/unregistered passes {@link PIXI.ExtensionFormat}.
     * @returns {PIXI.extensions} For chaining.
     */
    handle(type: ExtensionType, onAdd: ExtensionHandler, onRemove: ExtensionHandler): any;
    /**
     * Handle a type, but using a map by `name` property.
     * @param type - Type of extension to handle.
     * @param map - The object map of named extensions.
     * @returns {PIXI.extensions} For chaining.
     */
    handleByMap(type: ExtensionType, map: Record<string, any>): any;
    /**
     * Handle a type, but using a list of extensions.
     * @param type - Type of extension to handle.
     * @param list - The list of extensions.
     * @returns {PIXI.extensions} For chaining.
     */
    handleByList(type: ExtensionType, list: any[]): any;
};

/**
 * Collection of valid extension types.
 * @memberof PIXI
 * @property {string} Application - Application plugins
 * @property {string} RendererPlugin - Plugins for Renderer
 * @property {string} CanvasRendererPlugin - Plugins for CanvasRenderer
 * @property {string} Loader - Plugins to use with Loader
 * @property {string} LoadParser - Parsers for Assets loader.
 * @property {string} ResolveParser - Parsers for Assets resolvers.
 * @property {string} CacheParser - Parsers for Assets cache.
 */
export declare enum ExtensionType {
    Application = "application",
    RendererPlugin = "renderer-webgl-plugin",
    CanvasRendererPlugin = "renderer-canvas-plugin",
    Loader = "loader",
    LoadParser = "load-parser",
    ResolveParser = "resolve-parser",
    CacheParser = "cache-parser",
    DetectionParser = "detection-parser"
}

export { }
