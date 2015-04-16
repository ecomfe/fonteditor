

var upFile = document.getElementById('upload-file');
upFile.addEventListener('change', onUpFileChange);

function onUpFileChange(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {

      var font = new Font("font", new Stream(e.target.result), {
        loadedName: 'font',
        type: 'TrueType',
        differences: [],
        defaultEncoding: []
      });

      font.data;

    }

    reader.onerror = function(e) {
        console.error(e);
    };

    reader.readAsArrayBuffer(file);
}


