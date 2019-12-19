

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
    request.open('GET', 'http://127.0.0.1:5000/getKNN/4/'+concept.value, false)
    var list = new Array()
    var index=0;
    function stringify(val, depth, replacer, space) {
        depth = isNaN(+depth) ? 1 : depth;
        function _build(key, val, depth, o, a) { // (JSON.stringify() has it's own rules, which we respect here by using it for property iteration)
            return !val || typeof val != 'object' ? val : (a=Array.isArray(val), JSON.stringify(val, function(k,v){ if (a || depth > 0) { if (replacer) v=replacer(k,v); if (!k) return (a=Array.isArray(v),val=v); !o && (o=a?[]:{}); o[k] = _build(k, v, a?depth:depth-1); } }), o||(a?[]:{}));
        }
        return JSON.stringify(_build('', val, depth), null, space);
    }
    let node = new Object();

    request.onload = function() {
        var data = JSON.parse(this.response)
        //var listConcept = [];
        node.name = concept.value;
        node.children = [];
        for(let x = 0; x < 4 ; x++){
            let childnode = new Object();
            childnode.name = "name"
            childnode.note = "note"
            childnode.address = "wikipedia.org"
            if (data[x][0])
                childnode.name = data[x][0]
            else
                childnode.name = "name"
            childnode.note = "coucou";

            childnode.children = []
            let request2 = new XMLHttpRequest()
            request2.open('GET', 'http://127.0.0.1:5000/get/recommandation/'+data[x][0], false)
            let index = 0;
            request2.onload = function() {
                let datachild = JSON.parse(this.response)
                for(let i = 0; i < 4 ; i ++) {

                    let rec = datachild["output"]["rec_materials"];
                    console.log(rec[i])
                    let childchildnode = new Object();

                    childchildnode.name = "name";
                    childchildnode.note = "note";
                    childchildnode.address = "wikipedia.org";
                    if (rec[i]["title"] != null && rec[i]["title"] != "" && rec[i]["description"] != "" && rec[i]["description"] != null && rec[i]["material_id"] != 117087) {
                        childchildnode.name = rec[i]["title"];
                        childchildnode.note = rec[i]["description"];
                        childchildnode.address = rec[i]["url"];
                        childnode.children.push(childchildnode);
                    }

                }
            node.children.push(childnode);
            }
            request2.send()
        }

    }
    // Send request
    request.send()
  createCodeFlower(JSON.stringify(node));

    console.log(JSON.stringify(node));
}