var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
const Recognizer = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
const GrammarList = globalThis.SpeechGrammarList || globalThis.webkitSpeechGrammarList
const recognition = new Recognizer()
const speechRecognitionList = new GrammarList()
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList
recognition.lang = 'en-US'
recognition.interimResults = false
recognition.maxAlternatives = 1

function startRecognize(onresult, onstop, debug = true) {
    recognition.start()
    if(debug) console.log('Recognition is started!')

    recognition.onresult = function(event) {
        console.log(event.results)
        var color = event.results[0][0].transcript
        onresult(color)
        recognition.stop()
        onstop()
    }
}