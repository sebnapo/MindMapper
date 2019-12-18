var myLink = document.getElementById('search');


myLink.onclick = function(){
    var concept = document.getElementById('concept');
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()
    var conceptVal = concept.value
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'http://127.0.0.1:5000/getKNN/4/'+concept.value, true)
    var list = new Array()
    var index=0;
    request.onload = function() {
        var data = JSON.parse(this.response)
        var listConcept = [];
        var listDocs = [];
        var listNames = [];

        for(x = 0; x < 4 ; x++){
            listConcept[data[x][0]]= []
            currentName = data[x][0]
            listNames[x] = currentName;
            var request2 = new XMLHttpRequest()
            console.log(currentName)
            request2.open('GET', 'http://127.0.0.1:5000/get/recommandation/'+currentName, true)
            var index = 0;
            request2.onload = function() {
                var data = JSON.parse(this.response)
                for(i = 0; i < 4 ; i ++) {
                    concept = {}
                    rec = data["output"]["rec_materials"]
                    concept = {"name" : rec[i]["title"],
                        "description": rec[i]['description'],
                        "url" : rec[i]['url'] };
                    console.log(currentName)
                    listDocs[i] = concept
                }
                listConcept[listNames[index]] = listDocs;
                listDocs = []
                index++;
            }
            request2.send()
        }
        var myJsonString = JSON.stringify(listConcept);
        console.log(myJsonString)
        console.log(listConcept)
    }
    // Send request
    request.send()
};