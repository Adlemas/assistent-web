const audioContainer = document.getElementById('audio-pitches')

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new AudioContext()
        const analyser = audioContext.createAnalyser()
        const microphone = audioContext.createMediaStreamSource(stream)
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1)

        const mediaRecorder = new MediaRecorder(stream)

        analyser.smoothingTimeConstant = 0.8
        analyser.fftSize = 1024

        var timeInterval = null
        var time = 0

        function str_pad_left(string,pad,length) {
            return (new Array(length+1).join(pad)+string).slice(-length);
        }
        
        function connect() {
            microphone.connect(analyser)
            analyser.connect(scriptProcessor)

            scriptProcessor.connect(audioContext.destination)

            mediaRecorder.start()

            if(timeInterval !== null)
                clearInterval(timeInterval)

            time = 0;
            
            timeInterval = setInterval(() => {
                time++;
                var minutes = Math.floor(time / 60)
                var seconds = time - (minutes * 60)
                var hours = Math.floor(time / 3600)

                document.getElementById('time').innerText = str_pad_left(hours, '0', 2) + ':' + str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2)
            }, 1000)
        }

        function disconnect() {
            scriptProcessor.disconnect()
            analyser.disconnect()
            microphone.disconnect()

            if(timeInterval !== null)
                clearInterval(timeInterval)

            timeInterval = null
            time = 0

            document.getElementById('time').innerText = '00:00:00'

            audioContainer.innerHTML = ''
        }

        window.onmousedown = connect

        window.onmouseup = disconnect

        window.ontouchstart = connect
        window.ontouchend = disconnect
        window.ontouchcancel = disconnect

        scriptProcessor.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount)
            analyser.getByteFrequencyData(array);
            const arraySum = array.reduce((a, value) => a + value, 0)
            const averrage = Math.min(100, Math.round(arraySum / array.length))
            const pitch = document.createElement('li')
            pitch.style.height = `${averrage * 2}px`
            pitch.className = 'pitch'
            audioContainer.appendChild(pitch)
            audioContainer.scrollTo(audioContainer.scrollWidth, 0)
        }

    })
    .catch(err => {
        console.log(err)
    })