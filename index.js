var path = require('path')
var fs = require('fs')

var p = require('xml2js').parseString;

fs.readFile(path.resolve(__dirname, '30000001.xml'), function(err, data) {
         
    p(data, function(err, result) {
        
        var json = JSON.stringify(result, null, 2)

        fs.writeFile(path.resolve(__dirname, 'json','30000001.json'), json, (err) => {
            if (err) throw err;
            console.log('The file has been saved!')


            fs.readFile(path.resolve(__dirname, 'json','30000001.json'), 'utf8', function(err, data) {
              JSON.parse(data).Item.tags.map(t => console.log(t))
            })
        })
    });  
});



       









