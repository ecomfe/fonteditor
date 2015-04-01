exports.port = 8008;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home( 'index.html' )
        },

        {
            location: /\.css($|\?)/,
            handler: [
                autocss({
                    less: {
                        relativeUrls: false
                    }
                })
            ]
        },

        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },


        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
