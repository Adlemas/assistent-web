const recordButton = document.getElementById('recognition-btn')
const ripples = document.querySelectorAll('.onrecord')
// [document.getElementsByClassName('ripple1')[0], document.getElementsByClassName('ripple2')[0]]

recordButton.onclick = function() {
    ripples.forEach(ripple => {
        ripple.style.display = 'block'
    })

    startRecognize(function(color) {
        document.body.style.background = color
        document.getElementById('color').innerText = color.toUpperCase()
    }, function() {
        ripples.forEach(ripple => {
            ripple.style.display = 'none'
        })
    })
}