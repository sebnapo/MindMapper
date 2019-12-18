from flask import Flask
import pandas as pd # for easy and effective catalogue manipulation
import numpy as np # for mathematic stuff
import requests # for dealing with API
import json # to deal with json inputs/outputs
import gensim, logging
from gensim.models import Word2Vec
from flask import jsonify

app = Flask(__name__)

@app.route('/make/model')
def hello_world():
	list_parser = lambda x: x[1:-1].split(',')
	catalogue = pd.read_csv("../datasets/catalogue.tsv",sep="\t",converters={'keywords': list_parser,"concepts": list_parser})
	catalogue.columns = ['id', 'title', 'language', 'type', 'keywords', 'concepts']
	catalogue.set_index("id", inplace=True)
	test = catalogue["keywords"].to_numpy()
	mymodel = gensim.models.Word2Vec(test,size=1000,min_count=1,batch_words=4000,window=20)
	mymodel.save("./model/word2vec.model")
	
	return 'Hello, World!'

@app.route('/getKNN/<int:voisins>/<string:concept>')
def getKNN(voisins,concept):
	mymodel = Word2Vec.load("../model/word2vec300SG")
	result = mymodel.wv.similar_by_word(concept)[:voisins]
	print(result)
	return jsonify(result)

@app.route('/get/oerInfo/<int:id>')
def getOERInfos(id):
	PLATFORM_URL = "https://platform.x5gon.org/api/v1"
	get_specific_materials_endpoint = "/oer_materials/{}"
	response = requests.get(PLATFORM_URL + get_specific_materials_endpoint.format(id))
	r_json = response.json()
	print(r_json)
	return jsonify(r_json)

@app.route('/get/oerContent/<int:id>')
def getOERContent(id):
	PLATFORM_URL = "https://platform.x5gon.org/api/v1"
	get_specific_materials_endpoint = "/oer_materials/{}/contents/"
	response = requests.get(PLATFORM_URL + get_specific_materials_endpoint.format(id))
	r_json = response.json()
	return jsonify(r_json)

@app.route('/get/recommandation/<string:concept>')
def getRecommandation(concept):
	PLATFORM_URL = "http://wp3.x5gon.org/searchengine/v1"
	HEADERS = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
	}
	data = {"text": concept, "model_type": "doc2vec", "remove_duplicates": 1, "nb_wikiconcepts": 5, "return_wikisupport": 0 }
	r = requests.post(url = PLATFORM_URL, data =json.dumps(data),headers=HEADERS)
	r_json = r.json()
	return jsonify(r_json)