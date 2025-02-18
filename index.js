const React = require('react');
const ReactDOMServer = require('react-dom/server');
const assign = require('object-assign');
const _escaperegexp = require('lodash.escaperegexp');
const path = require('path');

const DEFAULT_OPTIONS = {
    doctype: '<!DOCTYPE html>',
    transformViews: true,
    babel: {
        presets: [
            '@babel/preset-react',
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: 'current',
                    },
                },
            ],
        ],
    },
};

function createEngine(engineOptions) {
    let registered = false;
    let moduleDetectRegEx;

    engineOptions = assign({}, DEFAULT_OPTIONS, engineOptions || {});

    function renderFile(filename, options, cb) {
        if (!moduleDetectRegEx) {
            moduleDetectRegEx = new RegExp(
                [].concat(options.settings.views).map(viewPath => '^' + _escaperegexp(viewPath)).join('|')
            );
        }

        if (engineOptions.transformViews && !registered) {
            require('@babel/register')(
                assign({ only: [].concat(options.settings.views) }, engineOptions.babel)
            );
            registered = true;
        }

        try {
            const props = options;

            const componentName = filename.split(path.sep).pop().replace('.jsx', '').replace('.js', '');

            let component = require(filename);
            component = component.default || component;

            const staticMarkup = ReactDOMServer.renderToString(
                React.createElement(component, props)
            );

            const html = `
            ${engineOptions.doctype}
            <div id="root">${staticMarkup}</div>
            <script>
                window.__INITIAL_COMPONENT__ = "${componentName}";
                window.__INITIAL_PROPS__ = ${JSON.stringify(props)};
            </script>
            <script src="/js/bundle.js"></script>
            `;

            cb(null, html);
        } catch (e) {
            cb(e);
        } finally {
            if (options.settings.env === 'development') {
                Object.keys(require.cache).forEach(module => {
                    if (moduleDetectRegEx.test(require.cache[module].filename)) {
                        delete require.cache[module];
                    }
                });
            }
        }
    }

    return renderFile;
}

exports.createEngine = createEngine;