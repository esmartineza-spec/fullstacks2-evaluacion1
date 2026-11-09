module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'webpack'],
        files: [
            { pattern: 'src/tests/**/*.spec.jsx', watched: false },
            { pattern: 'public/img/**/*', included: false, served: true, watched: false },
        ],
        preprocessors: {
            'src/tests/**/*.spec.jsx': ['webpack'],
        },
        webpack: {
            mode: 'development',
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', { modules: false }],
                                    ['@babel/preset-react', { runtime: 'automatic' }],
                                ],
                                plugins: [
                                    ['istanbul', {
                                        exclude: ['**/*.spec.jsx', '**/tests/**'],
                                    }],
                                ],
                            },
                        },
                    },
                ],
            },
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage', subdir: '.' },
                { type: 'text-summary' },
            ],
        },
        browsers: [],
        singleRun: false,
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-webpack'),
            require('karma-coverage'),
        ],
        proxies: {
            '/img/': '/base/public/img/',
        },
    });
};