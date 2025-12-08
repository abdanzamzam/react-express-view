import * as React from 'react';

export interface EngineOptions {
    doctype?: string;
    transformViews?: boolean;
    babel?: {
        presets?: any[];
        plugins?: any[];
        [key: string]: any;
    };
    React?: any;
    ReactDOMServer?: any;
}

export interface CreateEngine {
    (engineOptions?: EngineOptions): (
        filename: string,
        options: any,
        cb: (err: any, html?: string) => void
    ) => void;
}

export const createEngine: CreateEngine;
