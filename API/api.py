from flask import Flask
import pandas as pd # for easy and effective catalogue manipulation
import numpy as np # for mathematic stuff
import requests # for dealing with API
import json # to deal with json inputs/outputs
import gensim, logging
from gensim.models import Word2Vec
from flask import jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
	list_parser = lambda x: x[1:-1].split(',')
	catalogue = pd.read_csv("../datasets/catalogue.tsv",sep="\t",converters={'keywords': list_parser,"concepts": list_parser})
	catalogue.columns = ['id', 'title', 'language', 'type', 'keywords', 'concepts']
	catalogue.set_index("id", inplace=True)
	mymodel = Word2Vec.load("../model/word2vec300SG")
	return 'Hello, World!'

@app.route('/getKNN/<int:voisins>/<string:concept>')
def getKNN(voisins,concept):
	mymodel = Word2Vec.load("../model/word2vec300SG")
	result = mymodel.wv.similar_by_word(concept)[:voisins]
	print(result)
	return jsonify(result)