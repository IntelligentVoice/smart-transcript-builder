var path = require('path')
var fs = require('fs')

var p = require('xml2js').parseString;
var _html = [] // String that collects 'HTML' elements 

fs.readFile(path.resolve(__dirname, '30000001.xml'), function(err, data) {
         
    p(data, function(err, result) {
        
        var json = JSON.stringify(result, null, 2)

        fs.writeFile(path.resolve(__dirname, 'json','30000001.json'), json, (err) => {
            if (err) throw err;
            console.log('The file has been saved!')


            fs.readFile(path.resolve(__dirname, 'json','30000001.json'), 'utf8', function(err, data) {
              
               

              JSON.parse(data).Item.tags.map(tags => {
    
                tags.tags.map(tagObj => {

                    let { tag, position } = tagObj
                    
                    let tagName = tag[0] //tag[0] === <tag_name>
                    
                    if(position) {
                        position.map((p, i) => { 
                            //position is array of positions of a tag
                            
                            let timestamp = p.timestamp[0]
                            
                            if(i === 0) { //1st instance of tag found in transcript
                                
                                _html.push(`<a class="topics" href="javascript:seek2(${timestamp}, -5000);">${tagName}</a>`)
                            } else if (i > 0 && i < position.length - 1) { //All subsequent instances of tag found in transcript
                                _html.push(`(<a class="topics" href="javascript:seek2(${timestamp}, -5000);">${i+1}</a>)`)
                            } else {
                                _html.push(`(<a class="topics" href="javascript:seek2(${timestamp}, -5000);">${i+1}</a>)<br>`)
                            }
                        })
                    }               
                })
                
              })
              console.log(_html.toString())
            })
        })
    });  
});



       









