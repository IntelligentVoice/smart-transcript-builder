const path = require('path')
const fs = require('fs')
const request = require('request')
var buildPage = require('./build-page')

function createDocument (documentID) {
  var json // JS object of json body response
  var tags // tags/topics of a file
  var _html = [] // String that collects 'HTML' elements
  var _words = [] // String that collects 'span' words elements
  var _linkers = [] //Array of every timestamp
  var allText
  var words

  //request options to get data from server
  const options = {
    url: `${process.env.URL}${documentID}`,
    
    method: 'GET',
            'auth': {
            'user': process.env.USER,
            'pass': process.env.PASS,
            'sendImmediately': false
          },
    rejectUnauthorized : false,
    strictSSL : false
  }
    
  request.get(options, function(err, JumpToResponse) {
    if(err) {
      console.log('Error getting response from data server - ask the developer to check request sent')
    }
    console.log(JumpToResponse)
    Promise.resolve(JSON.parse(JumpToResponse.toJSON().body))
          .then(json => {

            words = json.Item.SRTs || ''
            tags = json.Item.tags? json.Item.tags.tags : undefined

            //Start traversing tags to create topic elements
            //TODO - Abstract into it's own function
            if(tags) { //If tags exists then proceed if not then skip!
              tags.map(tagObj => { 
        
                //tag contains <tagname> or <topic>
                let { tag, position } = tagObj

                if(position) { //Only create if position object/array exists
                  if (position.length === undefined) { //If position is an object

                  //Calculate timestamp in milliseconds
                  let timestamp = Math.round(position.timestamp * 1000)
                  
                  //Add <a> topic element to _html array
                  _html.push(`(<a class="topics" href="javascript:seek2(${timestamp}, -5000);">${tag}</a>)<br>`)

                } else { //If position is an array

                    position.map((p, i) => { 
                      //position is array of positions of a tag
                      
                      //Calculate timestamp in milliseconds
                      let timestamp = Math.round(p.timestamp * 1000)

                      //Create html tag elements and push to _html 
                      if(i === 0) { //1st instance of tag found in transcript   
                          _html.push(`<a class="topics" href="javascript:seek2(${timestamp}, -5000);">${tag}</a>`)
                      } else if (i > 0 && i < position.length - 1) { //All subsequent instances of tag found in transcript
                          _html.push(`(<a class="topics" href="javascript:seek2(${timestamp}, -5000);">${i+1}</a>)`)
                      } else { //If last instance of topic add a break <br> element 
                          _html.push(`(<a class="topics" href="javascript:seek2(${timestamp}, -5000);">${i+1}</a>)<br>`)
                      }
                    }) //End traversing tags arrays
                  } //END IF Position - Only create if position object/array exists
                } 
              }) //End traversing tags
            }

            //***********TRAVERSE WORDS************************************
            //Start traversing WORDS to create words in transcript
            //TODO - Abstract into own function

            if(words.words) { //Inconsistent data structure! Sometimes word array is wrapped in an object with 'words' property
              //TODO - DRY abstract into a function. The code in this IF block is effectively the same
              //as the proceeding ELSE block
              //Only difference is 'words.words' is being traversed using 'map' instead
              // 'words' ALSO! wordObj.id check instead of wordObj.word.id
              //wordObj.speakerLabel instead of wordObj.word.speakerLabel
              //wordObj.word instead of wordObj.words.word
              
              var _speakerLabelStatus = ''
              words.words.map(wordObj => {
              
              if(wordObj.id) { //If word is a single object

                //Only create a speakerLabel HTML element if speaker changes
                if(_speakerLabelStatus !== wordObj.speakerLabel) {
                  _speakerLabelStatus = wordObj.speakerLabel
                  _words.push(`<span class="label">${wordObj.speakerLabel}</span>`)
                }
                  
                //Calculate timestamp in ms
                //TODO - Create a handler function as this calculation is performed in other areas of the code base 
                let timestamp = Math.round(wordObj.timestamp * 1000)
               
                
                //console.log('This must be an object', wordObj)
                _words.push(`<span onClick="seek2(${timestamp});">${wordObj.word}</span>`)

                //Add timestamp to _linkers array
                _linkers.push(timestamp)

              } else { //If wordObj contains an array of words

                  _words.push(`<span class="label">${wordObj.words[0].speakerLabel}</span>`)
                  wordObj.words.map((_wordObj, i) => {
                    
                    let { timestamp, word } = _wordObj

                    //Calculate timestamp in ms
                    timestamp = Math.round(timestamp*1000)

                    let position = `position_${timestamp}`
                    
                    if(i !== wordObj.words.length - 1 ) {
                      
                      _words.push(`<span id=${position} onClick="seek2(${timestamp});">${word}</span>`)

                      //Push timestamp to _linkers array
                      _linkers.push(timestamp)

                    } else { //Add break element <br> to last word
                      _words.push(`<span id=${position} onClick="seek2(${timestamp});">${word}</span><br>`)

                      //Push timestamp to _linkers array
                      _linkers.push(timestamp)
                    }
                  })
                }               
              }) //End traversing words  

            } else { //else 'words' either an array therefore apply the map function
                     //OR 'words' doesn't exist

              if(words) { //Only proceed to traverse the array if 'words' actually exists!
                words.map(wordObj => {
                
                if(wordObj.words.id) { //If word is a single object

                  //Calculate timestamp in ms
                  //TODO - Create a handler function as this calculation is performed in other areas of the code base 
                  let timestamp = Math.round(wordObj.timestamp * 1000)
                
                  _words.push(`<span class="label">${wordObj.words.speakerLabel}</span>`)
                  //console.log('This must be an object', wordObj)
                  _words.push(`<span onClick="seek2(${timestamp});">${wordObj.words.word}</span><br>`)

                  //Add timestamp to _linkers array
                  _linkers.push(timestamp)

                } else { //If wordObj contains an array of words

                    _words.push(`<span class="label">${wordObj.words[0].speakerLabel}</span>`)
                    wordObj.words.map((_wordObj, i) => {
                      
                      let { timestamp, word } = _wordObj

                      //Calculate timestamp in ms
                      timestamp = Math.round(timestamp*1000)

                      let position = `position_${timestamp}`
                      
                      if(i !== wordObj.words.length - 1 ) {
                        
                        _words.push(`<span id=${position} onClick="seek2(${timestamp});">${word}</span>`)

                        //Push timestamp to _linkers array
                        _linkers.push(timestamp)

                      } else { //Add break element <br> to last word
                        _words.push(`<span id=${position} onClick="seek2(${timestamp});">${word}</span><br>`)

                        //Push timestamp to _linkers array
                        _linkers.push(timestamp)
                      }
                    })
                  }               
                }) //End traversing words
              } //End IF words exists  
            }       
          })
          .then(() => {
            //console.log('pre-build', _words.toString())
            //Build the html page and write to a file                
            return buildPage(_html.toString(), `${process.env.SRC}`, _words.join(" "), _linkers)
                                                                    
          })
          .then(htmlData => {              
                fs.writeFile(path.resolve(__dirname, 'html',`${documentID}.html`), htmlData, (err) => {
                  if(err) {
                      console.log('Error writing HTML file')
                  }
                  console.log(`The file ${documentID} has been created successfully!`)
                })
          })  // End promise chain
          .catch(err => console.log(`Failed trying to create file ${documentID} ----- ${err}`))       
  }) //End request to data server

} //End createDocument

module.exports = createDocument