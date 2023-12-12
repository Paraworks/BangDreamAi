import type { ENV } from '@pixi/constants';
import { GC_MODES } from '@pixi/constants';
import { MIPMAP_MODES } from '@pixi/constants';
import { MSAA_QUALITY } from '@pixi/constants';
import { PRECISION } from '@pixi/constants';
import { SCALE_MODES } from '@pixi/constants';
import { WRAP_MODES } from '@pixi/constants';

export declare const BrowserAdapter: IAdapter;

export declare type ContextIds = '2d' | 'webgl' | 'experimental-webgl' | 'webgl2';

/**
 * This interface describes all the DOM dependent calls that Pixi makes throughout its codebase
 * Implementations of this interface can be used to make sure Pixi will work in any environment
 * such as browser, web workers, and node
 */
export declare interface IAdapter {
    /** Returns a canvas object that can be used to create a webgl context. */
    createCanvas: (width?: number, height?: number) => HTMLCanvasElement;
    /** Returns a webgl rendering context. */
    getWebGLRenderingContext: () => typeof WebGLRenderingContext;
    /** Returns a partial implementation of the browsers window.navigator */
    getNavigator: () => {
        userAgent: string;
    };
    /** Returns the current base URL For browser environments this is either the document.baseURI or window.location.href */
    getBaseUrl: () => string;
    fetch: (url: RequestInfo, options?: RequestInit) => Promise<Response>;
}

export declare interface IRenderOptions {
    view: HTMLCanvasElement;
    antialias: boolean;
    autoDensity: boolean;
    backgroundColor: number;
    backgroundAlpha: number;
    useContextAlpha: boolean | 'notMultiplied';
    clearBeforeRender: boolean;
    preserveDrawingBuffer: boolean;
    width: number;
    height: number;
    legacy: boolean;
}

export declare interface ISettings {
    ADAPTER: IAdapter;
    MIPMAP_TEXTURES: MIPMAP_MODES;
    ANISOTROPIC_LEVEL: number;
    RESOLUTION: number;
    FILTER_RESOLUTION: number;
    FILTER_MULTISAMPLE: MSAA_QUALITY;
    SPRITE_MAX_TEXTURES: number;
    SPRITE_BATCH_SIZE: number;
    RENDER_OPTIONS: IRenderOptions;
    GC_MODE: GC_MODES;
    GC_MAX_IDLE: number;
    GC_MAX_CHECK_COUNT: number;
    WRAP_MODE: WRAP_MODES;
    SCALE_MODE: SCALE_MODES;
    PRECISION_VERTEX: PRECISION;
    PRECISION_FRAGMENT: PRECISION;
    CAN_UPLOAD_SAME_BUFFER: boolean;
    CREATE_IMAGE_BITMAP: boolean;
    ROUND_PIXELS: boolean;
    RETINA_PREFIX?: RegExp;
    FAIL_IF_MAJOR_PERFORMANCE_CAVEAT?: boolean;
    UPLOADS_PER_FRAME?: number;
    SORTABLE_CHILDREN?: boolean;
    PREFER_ENV?: ENV;
    STRICT_TEXTURE_CACHE?: boolean;
    MESH_CANVAS_PADDING?: number;
    TARGET_FPMS?: number;
}

export declare const isMobile: isMobileResult;

declare type isMobileResult = {
    apple: {
        phone: boolean;
        ipod: boolean;
        tablet: boolean;
        universal: boolean;
        device: boolean;
    };
    amazon: {
        phone: boolean;
        tablet: boolean;
        device: boolean;
    };
    android: {
        phone: boolean;
        tablet: boolean;
        device: boolean;
    };
    windows: {
        phone: boolean;
        tablet: boolean;
        device: boolean;
    };
    other: {
        blackberry: boolean;
        blackberry10: boolean;
        opera: boolean;
        firefox: boolean;
        chrome: boolean;
        device: boolean;
    };
    phone: boolean;
    tablet: boolean;
    any: boolean;
};

/**
 * User's customizable globals for overriding the default PIXI settings, such
 * as a renderer's default resolution, framerate, float precision, etc.
 * @example
 * // Use the native window resolution as the default resolution
 * // will support high-density displays when rendering
 * PIXI.settings.RESOLUTION = window.devicePixelRatio;
 *
 * // Disable interpolation when scaling, will make texture be pixelated
 * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
 * @namespace PIXI.settings
 */
export declare const settings: ISettings;

export { }
