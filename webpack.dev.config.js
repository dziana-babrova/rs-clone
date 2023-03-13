const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "../dist"),
    },
};
