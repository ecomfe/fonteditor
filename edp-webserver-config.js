exports.port = 9999;
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
                autocss()
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
            location: /\.tpl\.js/,
            handler: [
                html2js({
                    wrap: true,
                    mode: 'default'
                })
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
