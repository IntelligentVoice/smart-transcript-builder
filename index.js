var path = require('path')
var fs = require('fs')

var buildPage = require('./build-page');

var p = require('xml2js').parseString;
var _html = [] // String that collects 'HTML' elements

var documentID = process.argv[2];

console.log(`Creating HTML file...${documentID}.html in ${path.resolve(__dirname, 'html')}`)

if(documentID) {
    fs.readFile(path.resolve(__dirname, 'xml', `${documentID}.xml`), function(err, data) {
    
    if(err) {
        console.log(`Error - Node having trouble reading XML file.
        Error message: ${err}
        `)
    }

    p(data, function(err, result) {

        if(err) {
            console.log(`Error - xml2js having trouble parsing XML file.
            Error message: ${err}
            `)
        }
   
        var json = JSON.stringify(result, null, 2)

        fs.writeFile(path.resolve(__dirname, 'json',`${documentID}.json`), json, (err) => {
            if (err) throw err;
            
            fs.readFile(path.resolve(__dirname, 'json',`${documentID}.json`), 'utf8', function(err, data) {
              
              JSON.parse(data).Item.tags.map(tags => {
    
                tags.tags.map(tagObj => {

                    let { tag, position } = tagObj
                    
                    let tagName = tag[0] //tag[0] === <tag_name>
                    
                    if(position) {
                        position.map((p, i) => { 
                            //position is array of positions of a tag
                            
                            //Calculate timestamp in milliseconds
                            let timestamp = Math.round(p.timestamp[0] * 1000) 
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

              Promise.resolve(buildPage(_html.toString(), `https://comprindeo.intelligentvoice.com/JumpToWeb/sites/default/files/document_cache/30.${documentID}.${documentID}.mp4`))
                     .then(htmlData => {
                         //console.log(htmlData)
                         fs.writeFile(path.resolve(__dirname, 'html',`${documentID}.html`), htmlData, (err) => {
                             if(err) {
                                 console.log('Error writing HTML file')
                             }

                             console.log('The file has been saved successfully!')
                         })
                     })
                })
            })
        });  
    });
} else {
    console.log(`
    Exiting program - no HTML file was created. Please specify a file name.
    
    i.e If you want to create a HTML file named 'index' then from the command line type:
    $node index index

    If you want to create a HTML file named 'foo' then from the command line type:
    $node index foo

    `)
}



       









