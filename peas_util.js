/**
 * TODO
 * @module peas_util
 */
define("peas_util", ["bower_components/jquery/dist/jquery", "bower_components/graph/lib/graph"], function (graph) {
	
	
	//***************
	//** Constants **
	//***************
	
	var serviceMaximalCliquesUrl = "http://localhost:8080/eexcess-privacy-proxy/api/v1/getCliques";
	var serviceMaximalCliquesType = "GET";
	
	var serviceGraphUrl = "http://localhost:8080/eexcess-privacy-proxy/api/v1/getCoOccurrenceGraph";
	var serviceGraphType = "GET";
	
	var serviceDictionaryUrl = "http://localhost:8080/eexcess-privacy-proxy/api/v1/getDictionary";
	var serviceDictionaryType = "GET";
	
	var STORAGE_PREFIX = "peas."
	
	var frequencyWidth = 2; // XXX How to fix it? 
	
	//************
	//** Module **
	//************
	
	var peas_util = {

			/**
			 * TODO
			 * @method getCliques
			 * @return {Array}
			 */
			getMaximalCliques(){
				return maximalCliques;
			},
			
			/**
			 * TODO
			 * @method getMaximalCliquesOfSize
			 * @param {Integer} size
			 * @return {Array}
			 */
			getMaximalCliquesOfSize(size){
				var clqs = new Array();
				for (var i = 0 ; i < maximalCliques.length ; i++){
					var clique = maximalCliques[i];
					if (clique.order() == size){
						clqs[clqs.length] = clique;
					}
				}
				return clqs;
			}, 
			
			/**
			 * TODO
			 * @method getMaximalCliquesBiggerThan
			 * @param {Integer} size
			 * @return {Array}
			 */
			getMaximalCliquesBiggerThan(size){
				var clqs = new Array();
				for (var i = 0 ; i < maximalCliques.length ; i++){
					var clique = maximalCliques[i];
					if (clique.order() > size){
						clqs[clqs.length] = clique;
					}
				}
				return clqs;
			}, 
			
			/**
			 * TODO
			 * @method getVocabulary
			 */
			getVocabulary(){
				var vocab = new Array();
				for (var i = 0 ; i < graph.order() ; i++){
					var term = graph._vertices[i];
					vocab[i] = term;
				}
				return vocab;
			},
			
			/**
			 * TODO
			 * @method getCoOccurrenceGraph
			 * @return {Graph}
			 */
			getCoOccurrenceGraph(){
				return graph;
			},
			
			/**
			 * TODO
			 * @method getDictionary
			 * @return {Array}
			 */
			getDictionary(){
				return dictionary;
			},
			
			/**
			 * TODO
			 * @method getMinFrequency
			 * @param {JSONObject} query
			 * @return {Integer} 
			 */
			getMinFrequency(originalCK){
				var minFreq = Number.MAX_VALUE; 
				var arrayWords = new Array();
				for (var i = 0 ; i < originalCK.length ; i++){
					arrayWords[i] = originalCK[i].text;
				}
				for (var i = 0 ; i < arrayWords.length ; i++){
					for (var j = (i+1) ; j < arrayWords.length ; j++){
						var freq = graph.get(arrayWords[i], arrayWords[j]);
						if (freq != undefined){
							if (freq < minFreq){
								minFreq = freq;
							}
						} else {
							minFreq = 0;
						}
					}
				}
				return minFreq;
			}, 
			
			getFrequencyWindow(minFreqQuery){
				var window = new Object();
				var a = minFreqQuery - (frequencyWidth / 2);
				var b = minFreqQuery;
				window.lowerBound = Math.floor((Math.random() * (b + 1 - a)) + a);
				window.upperBound = window.lowerBound + frequencyWidth;
				return window; 
			}
			
	};
	
	//*********************
	//** Initializations **
	//*********************
	
	var maximalCliques = initializeMaximalCliques();
	var graph = initializeCoOccurrenceGraph();
	var dictionary = initializeDictionary();
	
	//************************
	//** Cliques Management **
	//************************
	
	function initializeMaximalCliques(){
		var clqs = new Array();
		// TODO determine if cliques are stored locally
		var cliquesStoredLocally = false;
		// TODO collect this info
		var freshCliquesRequested = true;
		if (!cliquesStoredLocally || freshCliquesRequested){
			clqs = getRemoteMaximalCliques();
		} else {
			clqs = getLocalMaximalCliques();
		}
		return clqs;
	}
	
	function getRemoteMaximalCliques(){
		var clqs = new Array();
		jQuery.ajax({
			async: false,
			type: serviceMaximalCliquesType,
			url: serviceMaximalCliquesUrl,
			success: function(dataCliques) {
				clqs = buildMaximalCliques(dataCliques);
			}
		});
		return clqs;
	}

	function getLocalMaximalCliques(){
		// TODO
		return getRemoteMaximalCliques();
	}
	
	function storeMaximalCliquesLocally(){}
	
	function buildMaximalCliques(dataCliques){
		var clqs = new Array();
		for (var i = 0 ; i < dataCliques.length ; i++){
			var dataClique = dataCliques[i];
			var clq = new Graph();
			for (var j = 0 ; j < dataClique.length ; j++){
				var vertex1 = dataClique[j].term;
				var frequencies = dataClique[j].frequencies;
				for (var k = 0 ; k < frequencies.length ; k++){
					var vertex2 = frequencies[k].term;
					var frequency = frequencies[k].frequency;
					clq.set(vertex1, vertex2, frequency);
				}
			}
			clqs[i] = clq;
		}
		return clqs;
	}
	
	//***********************************
	//** Co-Occurrence Graph Management **
	//***********************************
	
	function initializeCoOccurrenceGraph(){
		var gph = new Graph();
		// TODO determine if the graph is stored locally
		var graphStoredLocally = false;
		// TODO collect this info
		var freshGraphRequested = true;
		if (!graphStoredLocally || freshGraphRequested){
			gph = getRemoteCoOccurrenceGraph();
		} else {
			gph = getLocalCoOccurrenceGraph();
		}
		return gph;
	}
	
	function getRemoteCoOccurrenceGraph(){
		var gph = new Graph();
		jQuery.ajax({
			async: false,
			type: serviceGraphType,
			url: serviceGraphUrl,
			success: function(dataGraph) {
				gph = buildCoOccurrenceGraph(dataGraph);
			}
		});
		return gph;
	}
	
	function getLocalCoOccurrenceGraph(){
		return getRemoteCoOccurrenceGraph();
	}
	
	function storeCoOccurrenceGraphLocally(){}
	
	function buildCoOccurrenceGraph(dataGraph){
		var gph = new Graph();
		for (var i = 0 ; i < dataGraph.length ; i++){
			var vertex1 = dataGraph[i].term;
			var frequencies = dataGraph[i].frequencies;
			for (var j = 0 ; j < frequencies.length ; j++){
				var vertex2 = frequencies[j].term;
				var frequency = frequencies[j].frequency;
				gph.set(vertex1, vertex2, frequency);
			}
		}
		return gph;
	}
	
	//***************************
	//** Dictionary Management **
	//***************************
	
	function initializeDictionary(){
		var dic = new Array();
		// TODO determine if the dictionary is stored locally
		var dictionaryStoredLocally = false;
		// TODO collect this info
		var freshDictionaryRequested = true;
		if (!dictionaryStoredLocally || freshDictionaryRequested){
			dic = getRemoteDictionary();
		} else {
			dic = getLocalDictionary();
		}
		return dic;
	}
	
	function getRemoteDictionary(){
		var dic = new Array();
		jQuery.ajax({
			async: false,
			type: serviceDictionaryType,
			url: serviceDictionaryUrl,
			 dataType: "json", 
			success: function(dataDic) {
				dic = buildDictionary(dataDic);
			}, 
			error: function(a, b, c){
				console.log("error: " + c);
			}
		});
		return dic;
	}
	
	function getLocalDictionary(){
		return getRemoteDictionary();
	}
	
	function storeDictionaryLocally(){}
	
	function buildDictionary(dataDic){
		var dic = new Array();
		for (var i = 0 ; i < dataDic.length ; i++){
			dic[i] = dataDic[i].term;
		}
		return dic;
	}
	
	/**
	 * Stored a pair (key, value) in the data store. 
	 * It will over-write the previous value if the key already exists in the data store.  
	 * @param id Key to be stored. 
	 * @param value Value to be stored. 
	 * @method storeValue
	 */
	function storeValue(id, value){
		localStorage.setItem(STORAGE_PREFIX + id, value);
	}

	/**
	 * Retrieves the value corresponding to a given key from the data store. 
	 * @param {String} id Key of the value to be retrieved. 
	 * @returns {String} Value corresponding to the key. 
	 * @method getStoredValue
	 */
	function getStoredValue(id){
		var value = localStorage.getItem(STORAGE_PREFIX + id);
		if (value == "null"){ value = null; } // FIXME Not clear why the value is sometimes equal to "null" (instead of null)
		return value;
	}
	
	return peas_util;
});