type IItem<T extends object = object> = T & Record<string, any>;
type IDynamicGridInternalContextData = {
    counter: number;
    theme: string;
    locale: string;
    scrollY: number;
    route: {
        path: string;
        query: Record<string, string>;
        params: Record<string, string>;
    };
};
type IWidgetMeta = {
    dataType: string;
    defaultProps: IItem | ((payload: {
        widget: IWidgetComponent;
    }) => IItem);
    description: string | (() => string);
    icon: string;
    label: string | (() => string);
    type: string;
};
type IWidgetComponent = {
    meta: IWidgetMeta;
};
type DynamicGridItem = {
    id: string | number;
    uuid: string;
    buildingBlock: Record<string, any> & {
        type: string;
        value?: any;
    };
};
type IDynamicGridDesignSystemItemPayload = {
    /**
     * The widget that the design system item is for
     */
    widget: IWidgetComponent;
    /**
     * The building block that that the design system item is used in
     */
    item: DynamicGridItem;
    /**
     * The context data of the dynamic grid
     */
    getContextData: () => Record<string, any> & {
        internal: {
            value: IDynamicGridInternalContextData;
        };
        [key: string]: any;
    };
    /**
     * The store of the dynamic grid
     */
    getStore: () => any;
};

