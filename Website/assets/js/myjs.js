var myLink = document.getElementById('search');

myLink.onclick = function(){
    var concept = document.getElementById('concept');
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'http://127.0.0.1:5000/getKNN/4/'+concept.value, true)
    request.onload = function() {
        var data = JSON.parse(this.response)
        data.forEach(neigh => {
            // Log each movie's title
            console.log(neigh)
        })
    }
    // Send request
    request.send()
}