var myLink = document.getElementById('search');

var listConcept = [];

myLink.onclick = function(){
    var currentCodeFlower;
    var createCodeFlower = function (json) {
        var total = countElements(json);
        console.log(countElements(json))
        w = window.innerWidth;
        h = window.innerHeight * 0.75;
        currentCodeFlower = new CodeFlower("#visualization", w, h).update(json);
    };
    var concept = document.getElementById('concept');
    var concepts = []
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()
    var conceptVal = concept.value
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'http://127.0.0.1:5000/getKNN/4/'+concept.value, true)
    var list = new Array()
    var index=0;
    request.onload = function() {
        var data = JSON.parse(this.response)
        //var listConcept = [];
        var listDocs = [];
        var listNames = [];

        for(x = 0; x < 4 ; x++){
            currentName = data[x][0]
            listNames[x] = currentName;
            listConcept[x] = []
            console.log(currentName)
            var request2 = new XMLHttpRequest()
            console.log(listConcept)
            request2.open('GET', 'http://127.0.0.1:5000/get/recommandation/'+currentName, true)
            var index = 0;
            request2.onload = function() {
                var data = JSON.parse(this.response)
                for(i = 0; i < 4 ; i ++) {
                    concepts = []
                    rec = data["output"]["rec_materials"];
                    //console.log(rec)
                    concepts["name"] = rec[i]["title"];
                    concepts["description"] = rec[i]["description"];
                    concepts["url"] = rec[i]["url"];
                    /*concept = {"name" : rec[i]["title"],
                        "description": rec[i]['description'],
                        "url" : rec[i]['url'] };*/
                    console.log(concepts)
                    console.log(currentName)
                    listDocs[i] = concepts
                }
                listConcept[x]["child"] = []
                //listConcept[listNames[index]] = test;
                listConcept[x]["child"] = listDocs;
                listDocs = []
                index++;
            }
            request2.send()
        }

        console.log({listConcept})
        w = window.innerWidth;
        h = window.innerHeight * 0.75;
        test = getChildren(listConcept)
        //console.log(test)
        //createCodeFlower(listConcept)
    }
    // Send request
    request.send()
}