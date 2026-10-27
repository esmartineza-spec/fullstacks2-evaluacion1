module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'webpack'],
        files: [
            { pattern: 'src/tests/**/*.spec.jsx', watched: false },
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
                            },
                        },
                    },
                ],
            },
        },
        reporters: ['progress'],
        browsers: [],
        singleRun: false,
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-webpack'),
        ],
    });
};