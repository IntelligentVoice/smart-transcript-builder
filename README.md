A nodeJS application that generates smart video transcripts in HTML format

Installation Instructions

1. $ git clone https://github.com/IntelligentVoice/smart-transcript-builder.git
2. $ npm install


Running the application to generate smart transcripts html file(s):

1. From the command line 
    - $ node index.js <start_document_id> <end_document_id>
    - i.e If you want to generate smart transcripts for documents 101 to 105 type in:
      $ node index.js 101 105

2. Then from your browser go to http://localhost:8080

Go back to the command line to see confirmation that your files have been successfully created

The html files are saved in the same path directory as this application inside a folder name 'html'
