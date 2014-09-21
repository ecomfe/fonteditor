/**
 * @file filesystem.js
 * @author mengke01
 * @date 
 * @description
 * 文件系统入口
 */

define(
    function(require) {



        function errorHandler(e) {
          var msg = '';

          switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
            case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
            default:
              msg = 'Unknown Error';
              break;
          };

          console.log('Error: ' + msg);
        }


        function onInitFs(fs) {

          fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function(fileWriter) {

              fileWriter.onwriteend = function(e) {
                console.log('Write completed.');
                console.log(fileEntry.name);
                console.log(fileEntry.fullPath);
              };

              fileWriter.onerror = function(e) {
                console.log('Write failed: ' + e.toString());
              };

              // Create a new Blob and write it to log.txt.
              var bb = new Blob(['Lorem Ipsum'], {
                type: 'text/plain'
              }); // Note: window.WebKitBlobBuilder in Chrome 12.
              fileWriter.write(bb);

            }, errorHandler);

          }, errorHandler);

        }


        var entry = {
            /**
             * 初始化
             */
            init: function () {

                window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
                window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);

            }
        };

        entry.init();
        
        return entry;
    }
);