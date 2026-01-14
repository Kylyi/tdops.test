// From ofetch
interface $Fetch {
    <T = any, R extends ResponseType = "json">(request: FetchRequest, options?: FetchOptions<R>): Promise<MappedResponseType<R, T>>;
    raw<T = any, R extends ResponseType = "json">(request: FetchRequest, options?: FetchOptions<R>): Promise<FetchResponse<MappedResponseType<R, T>>>;
    native: Fetch;
    create(defaults: FetchOptions, globalOptions?: CreateFetchOptions): $Fetch;
}

// From ofetch
type FetchRequest = RequestInfo

type RequestInfo = any;

// From ofetch
interface FetchOptions<R extends ResponseType = ResponseType, T = any> extends Omit<RequestInit, "body">, FetchHooks<T, R> {
    baseURL?: string;
    body?: RequestInit["body"] | Record<string, any>;
    ignoreResponseError?: boolean;
    /**
     * @deprecated use query instead.
     */
    params?: Record<string, any>;
    query?: Record<string, any>;
    parseResponse?: (responseText: string) => any;
    responseType?: R;
    /**
     * @experimental Set to "half" to enable duplex streaming.
     * Will be automatically set to "half" when using a ReadableStream as body.
     * @see https://fetch.spec.whatwg.org/#enumdef-requestduplex
     */
    duplex?: "half" | undefined;
    /**
     * Only supported in Node.js >= 18 using undici
     *
     * @see https://undici.nodejs.org/#/docs/api/Dispatcher
     */
    dispatcher?: InstanceType<typeof undici.Dispatcher>;
    /**
     * Only supported older Node.js versions using node-fetch-native polyfill.
     */
    agent?: unknown;
    /** timeout in milliseconds */
    timeout?: number;
    retry?: number | false;
    /** Delay between retries in milliseconds. */
    retryDelay?: number | ((context: FetchContext<T, R>) => number);
    /** Default is [408, 409, 425, 429, 500, 502, 503, 504] */
    retryStatusCodes?: number[];
}

type RequestInit = any;

// From ofetch
interface FetchContext<T = any, R extends ResponseType = ResponseType> {
    request: FetchRequest;
    options: ResolvedFetchOptions<R>;
    response?: FetchResponse<T>;
    error?: Error;
}

// From ofetch
interface ResolvedFetchOptions<R extends ResponseType = ResponseType, T = any> extends FetchOptions<R, T> {
    headers: Headers;
}

// From ofetch
type ResponseType = keyof ResponseMap | "json"

// From ofetch
interface ResponseMap {
    blob: Blob;
    text: string;
    arrayBuffer: ArrayBuffer;
    stream: ReadableStream<Uint8Array>;
}

type ReadableStream = any;

// From ofetch
interface FetchResponse<T> extends Response {
    _data?: T;
}

// From ofetch
interface FetchHooks<T = any, R extends ResponseType = ResponseType> {
    onRequest?: MaybeArray<FetchHook<FetchContext<T, R>>>;
    onRequestError?: MaybeArray<FetchHook<FetchContext<T, R> & {
        error: Error;
    }>>;
    onResponse?: MaybeArray<FetchHook<FetchContext<T, R> & {
        response: FetchResponse<T>;
    }>>;
    onResponseError?: MaybeArray<FetchHook<FetchContext<T, R> & {
        response: FetchResponse<T>;
    }>>;
}

// From ofetch
type MaybeArray<T> = T | T[]

// From ofetch
type FetchHook<C extends FetchContext = FetchContext> = (context: C) => MaybePromise<void>

// From ofetch
type Fetch = typeof globalThis.fetch

// From ofetch
interface CreateFetchOptions {
    defaults?: FetchOptions;
    fetch?: Fetch;
    Headers?: typeof Headers;
    AbortController?: typeof AbortController;
}

// From ofetch
type MappedResponseType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType



type IDynamicGridItemDimension = {
    /**
     * The x-coordinate of the item
     */
    x: number;
    /**
     * The y-coordinate of the item
     */
    y: number;
    /**
     * The width of the item
     */
    w: number;
    /**
     * The height of the item
     */
    h: number;
    /**
     * The minimum width of the item
     */
    minW?: number;
    /**
     * The minimum height of the item
     */
    minH?: number;
    /**
     * The relative height of the item
     *
     * First number is the percent it should take of total height
     * Second number is the amount of cells that should be added/subtracted (~ the number can be negative)
     * For example: [100, 2] would basically mean something very similar to `calc(100% - calc(2 * rowHeight)px)`
     */
    relativeH?: [number, number];
    /**
     * The relative max height of the building block
     *
     * First number is the percent it should take of total height
     * Second number is the amount of cells that should be added/subtracted (~ the number can be negative)
     * For example: [100, 2] would basically mean something very similar to `calc(100% - calc(2 * rowHeight)px)`
     */
    relativeMaxH?: [number, number];
    /**
     * Layer ID of the item
     */
    layerId?: string | number;
    /**
     * Whether the item is hidden
     */
    hidden?: boolean;
    /**
     * Whether the item has dynamic height
     */
    dynamicHeight?: boolean;
    /**
     * The reference item id
     */
    reference?: string | number;
    /**
     * Fixed width of the item
     */
    fixedWidth?: string;
    /**
     * Fixed width justification
     *
     * If the value is set to anything but `null`, the item will be wrapped in a flex
     * container and the justification will be applied.
     *
     * If `null` is used, the item will simply use the fixed width as CSS `width` property.
     * This may impact the layout of the grid.
     */
    fixedWidthJustification?: 'flex-start' | 'flex-end' | 'center' | null;
};
type DynamicGridItem = {
    id: string | number;
    uuid: string;
    buildingBlock: Record<string, any> & {
        type: string;
        value?: any;
        customData?: Record<string, any>;
    };
    resultDimensions: IDynamicGridItemDimension;
    exposedFunctions: Record<string, (payload?: any) => void | Promise<void>>;
    getCustomData: () => Record<string, any>;
};
type IBuildingBlockRuntimeMeta = {
    value?: any;
    isDirty?: boolean;
    isFocused?: boolean;
    isFocusedWithin?: boolean;
    isHovered?: boolean;
    isActive?: boolean;
    hasAnyHoverDesignSystemItem?: boolean;
    hasAnyHoverVariant?: boolean;
    el?: HTMLElement | null;
};
type IDynamicGridContextDataPayload = {
    /**
     * Utility functions
     */
    utils: {
        /**
         * The fetch function
         */
        $fetch: (...args: Parameters<$Fetch>) => ReturnType<$Fetch>;
        /**
         * Use event source composable
         */
        useSse: any;
        /**
         * A helper function to update the value of self
         */
        updateSelf: (payload: any) => void;
    };
    /**
     * Context data handlers
     */
    contextData: {
        /**
         * Returns the context data object by its path
         */
        get: (path: string) => any;
        /**
         * Sets the value of the context data at the given path
         */
        set: (path: string, value: any) => void;
    };
    /**
     * Building blocks handlers
     */
    buildingBlocks: {
        /**
         * Returns the building block item by its UUID
         */
        get: (uuid: string) => DynamicGridItem | null;
        /**
         * Returns the runtime meta of the building block item by its UUID
         */
        getMeta: (uuid: string) => IBuildingBlockRuntimeMeta | null;
        /**
         * Returns the value of the building block item by its UUID
         */
        getValue: (uuid: string) => any;
        /**
         * A helper function to create an object based on the uuids of the items
         */
        makeData: (payload: {
            uuids: string[];
        }) => Record<string, any>;
        /**
         * Returns the dynamic grid item (`NestedGrid`)
         * that the current item is part of (if any)
         */
        getParentGrid: () => DynamicGridItem | null;
        /**
         * A helper function to call an exposed function of a building block
         */
        callExposedFunction: (payload: {
            itemUuid: string;
            name: string;
            payload?: any;
        }) => void | Promise<void>;
    };
    /**
     * The integrations
     */
    integrations?: {
        [DYNAMIC_INTEGRATION_NAME: string]: any;
    };
};

