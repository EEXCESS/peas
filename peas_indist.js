/**
 * TODO
 * @module peas_indist
 */
define("peas_indist", ["peas_util", "bower_components/jquery/dist/jquery", "bower_components/graph/lib/graph"], function (util, graph) {

	var peas_indist = {

			/**
			 * TODO
			 * @method obfuscateQuery
			 * @param {JSONObject} query
			 * @param {Integer} nbFakeQueries
			 * @return {JSONObject} 
			 */
			obfuscateQuery(query, nbFakeQueries){

				var obfuscatedQuery = query;
				var arrayCK = []; // CK = Context Keywords
				var profile = []; // XXX Should be initialized with the user profile 
				var originalCK = query.contextKeywords;
				var nbTerms = originalCK.length;
				var minFreq = util.getMinFrequency(originalCK);
				var freqWindow = util.getFrequencyWindow(minFreq);
				var lowerBound = freqWindow.lowerBound;
				var upperBound = freqWindow.upperBound;

				var usedTerms = merge(ckToArray(originalCK), profile); // List of the terms used in the original query, the user profile, and the already-generated queries 
				
				var idxFakeQuery = 0; 
				while (idxFakeQuery < nbFakeQueries){ // XXX Risk of infinite loop
					var fakeCK = generateFakeQuery(originalCK, lowerBound, upperBound);
					if (!intersect(usedTerms, ckToArray(fakeCK))){
						arrayCK[idxFakeQuery] = fakeCK;
						idxFakeQuery++;
						usedTerms = merge(usedTerms, ckToArray(fakeCK));
					} 
				}

				// At first, the original query is added at the end
				arrayCK[nbFakeQueries] = query.contextKeywords;
				// Then, to ensure the original query is not always at the end, 
				// it is switched with another element picked randomly
				var randomIndex = Math.floor(Math.random() * arrayCK.length);
				if (randomIndex != nbFakeQueries){
					// If the element picked is not the original query, the two elements are switched
					var swap = arrayCK[randomIndex];
					arrayCK[randomIndex] = arrayCK[nbFakeQueries];
					arrayCK[nbFakeQueries] = swap;
				}
				obfuscatedQuery.contextKeywords = arrayCK;
				return obfuscatedQuery;
			}, 

			/**
			 * TODO
			 * @method filterResults
			 * @param {JSONObject} results
			 * @param {JSONObject} query
			 * @return {JSONObject} 
			 */
			filterResults(results, query){
				var filteredResults = results;	// 'results.result' is an array of arrays and 'filteredResults.result' is just an array
				var arrayResult = results.result; 
				var maxScore = -1;
				var maxResult = new Array();
				for (var i = 0 ; i < arrayResult.length ; i++){
					var currentResult = arrayResult[i];
					var currentScore = getScore(currentResult, query.contextKeywords);
					if (currentScore > maxScore){
						maxScore = currentScore;
						maxResult = currentResult;
					}
				}
				filteredResults.result = maxResult; // Update of the result
				filteredResults.totalResults = maxResult.length; // Update the total number of results
				return filteredResults;
			}
	};

	var dictionary = util.getDictionary();

	/**
	 * TODO
	 */
	function getScore(result, keywords){
		// 'result' is an array of entry (each entry is a recommendation)
		// 'keywords' is an array of keywords (term + weight)
		var score = 0;
		var nbKeywords = keywords.length;
		var nbEntries = result.length;
		for (var i = 0 ; i < nbEntries ; i++){
			var entry = result[i];
			var scoreEntry = 0;
			for (var j = 0 ; j < nbKeywords ; j++){
				var keyword = keywords[j];
				var scoreKeyword = 0;
				if (entry.title != undefined){
					scoreKeyword += nbInstrances(entry.title, keyword.text);
				}
				if (entry.description != undefined){
					scoreKeyword += nbInstrances(entry.description, keyword.text);
				}
				scoreEntry += scoreKeyword;
			}
			score += scoreEntry;
		}
		return score;
	}

	/**
	 * TODO
	 */
	function nbInstrances(str, word) {
		str = str.toLowerCase();
		word = word.toLowerCase();
		var array = str.split(word);
		return (array.length - 1);
	}

	/**
	 * TODO
	 */
	function ckToArray(ck){
		var array = new Array();
		for (var i = 0 ; i < ck.length ; i++){
			array[i] = ck[i].text;
		}
		return array;
	}
	
	/**
	 * TODO
	 */
	function intersectCK(ck1, ck2){
		var array1 = ckToArray(ck1);
		var array2 = ckToArray(ck2);
		return intersect(array1, array2);
	}
	
	/**
	 * TODO
	 */
	function intersect(arr1, arr2){
		var intersect = false;
		for (var i = 0 ; (i < arr1.length) && (!intersect) ; i++){
			intersect = contains(arr2, arr1[i]);
		}
		return intersect;
	}
	
	/**
	 * TODO
	 */
	function contains(array, term){
		var found = false;
		for (var i = 0 ; (i < array.length) && (!found) ; i++){
			found = (array[i] == term);
		}
		return found;
	}
	
	function merge(arr1, arr2){
		var arr = new Array();
		for (var i = 0 ; i < arr1.length ; i++){
			arr[i] = arr1[i];
		}
		var cnt = arr1.length;
		for (var j = 0 ; j < arr2.length ; j++){
			if (!contains(arr, arr2[j])){
				arr[cnt + j] = arr2[j];
				cnt++;
			}
		}
		return arr;
	}

	/**
	 * TODO
	 */
	function generateFakeQuery(originalCK, lowerBound, upperBound){
		var fakeQuery = new Array();
		var nbTerms = originalCK.length;
		var nbStrategies = 3;
		var strategy = Math.floor(Math.random() * nbStrategies) + 1; // Determines which strategy is going to be used: 1, 2 or 3
		randomNumber = 1 /* 2 */ /* 3 */ ;  
		
		// We do a sequential inspection of the strategy to use, as it may evolve.
		// For instance, if strategy 1 fails, then strategy 2 will be employed. 
		
		// Strategy 1: pick terms from a randomly picked maximal clique of size nbTerms
		if (strategy == 1) {
			var cliques = util.getMaximalCliquesOfSize(nbTerms);
			if (cliques.length > 0){
				var oneFound = false;
				var randomCliqueIdx = Math.floor(Math.random() * cliques.length);
				var randomClique = cliques[randomCliqueIdx];
				for (var i = 0 ; i < originalCK.length ; i++){
					var fakeTerm = new Object();
					fakeTerm.text = randomClique._vertices[i];
					fakeTerm.weight = originalCK[i].weight;
					fakeQuery[i] = fakeTerm;
				}
			} else {
				strategy = 2;
			}
		}
		
		// Strategy 2: pick terms from a randomly picked maximal clique of size greater than nbTerms
		if (strategy == 2){
			var cliques = util.getMaximalCliquesBiggerThan(nbTerms);
			if (cliques.length > 0){
				var randomCliqueIdx = Math.floor(Math.random() * cliques.length);
				var randomClique = cliques[randomCliqueIdx];
				for (var i = 0 ; i < originalCK.length ; i++){
					var fakeTerm = new Object();
					fakeTerm.text = randomClique._vertices[i];
					fakeTerm.weight = originalCK[i].weight;
					fakeQuery[i] = fakeTerm;
				}
			} else {
				strategy = 3;
			}
		}
		
		// Strategy 3: randomly pick nbTerms in the group profile
		if (strategy == 3){ 
			var vocabulary = util.getVocabulary();
			var i = 0;
			while (i < nbTerms){
				var fakeTerm = new Object();
				var randomIdx =  Math.floor(Math.random() * vocabulary.length);
				if (!contains(ckToArray(fakeQuery), vocabulary[randomIdx])){ // To prevent a word to be added twice
					fakeTerm.text = vocabulary[randomIdx];
					fakeTerm.weight = originalCK[i].weight;
					fakeQuery[i] = fakeTerm;
					i++;
				}
			}
		} 
		return fakeQuery;
	}

	return peas_indist;
});