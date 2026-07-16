import * as React from "react";

export interface EngineOptions {
  /** HTML doctype string (default: "<!DOCTYPE html>") */
  doctype?: string;
  /** Enable runtime Babel transpilation of views (default: true) */
  transformViews?: boolean;
  /** Custom Babel configuration passed to @babel/register */
  babel?: Record<string, any>;
  /** Inject your app's React instance to prevent Hook errors */
  React?: typeof React;
  /** Inject your app's ReactDOMServer instance */
  ReactDOMServer?: any;
  /** Client script URLs to include (default: ["/js/bundle.js"]) */
  clientScripts?: string[];
}

export interface RenderFile {
  (
    filename: string,
    options: Record<string, any>,
    cb: (err: Error | null, html?: string) => void
  ): void;
}

/**
 * Create an Express template engine that renders React components.
 *
 * @param engineOptions - Configuration options
 * @returns renderFile - The engine function for Express
 *
 * @example
 * ```js
 * const { createEngine } = require("react-express-view");
 * app.engine("jsx", createEngine());
 * ```
 */
export const createEngine: (engineOptions?: EngineOptions) => RenderFile;
