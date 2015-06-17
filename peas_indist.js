/**
 * TODO
 * @module peas_indist
 */
define("peas_indist", ["bower_components/graph/lib/graph"], function (graph) {
	
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
				var originalCK = query.contextKeywords;
				var nbTerms = originalCK.length;
				for (var idxFakeQuery = 0 ; idxFakeQuery < nbFakeQueries ; idxFakeQuery++){
					var fakeCK = new Array(); 
					for (var idxTerm = 0 ; idxTerm < nbTerms ; idxTerm++){
						var fakeTerm = new Object();
						// In this version, the fake query generation does nothing except adding a number at the end of the keyword
						fakeTerm.text = originalCK[idxTerm].text + "_" + (idxFakeQuery+1);
						fakeTerm.weight = originalCK[idxTerm].weight;
						fakeTerm.reason = originalCK[idxTerm].reason;
						fakeCK[idxTerm] = fakeTerm;
					}
					arrayCK[idxFakeQuery] = fakeCK;
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
	
	return peas_indist;
});