module.exports = {
    //  (terser plugin) SyntaxError: Unexpected token: punc (.)
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-typescript',
    ],
};
