define("peas_indist", [], function () {
	var peas_indist = {
		obfuscateQuery(query, nbFakeQueries){
			var obfuscatedQuery = [];
			var nbTerms = query.length;
			for (var idxFakeQuery = 0 ; idxFakeQuery < nbFakeQueries ; idxFakeQuery++){
				var fakeQuery = new Array(); 
				for (var idxTerm = 0 ; idxTerm < nbTerms ; idxTerm++){
					var fakeTerm = new Object();
					// In this version, the fake query generation does nothing but add a number at the end of the keyword
					fakeTerm.text = query[idxTerm].text + "_" + (idxFakeQuery+1);
					fakeTerm.weight = query[idxTerm].weight;
					fakeTerm.reason = query[idxTerm].reason;
					fakeQuery[idxTerm] = fakeTerm;
				}
				obfuscatedQuery[idxFakeQuery] = fakeQuery;
			}
			// At first, the original query is added at the end
			// Then, to ensure the original query is not always at the end, it is switched with another element
			obfuscatedQuery[nbFakeQueries] = query; 
			// An element of the array is randomly picked
			var randomIndex = Math.floor(Math.random() * obfuscatedQuery.length);
			if (randomIndex != nbFakeQueries){
				// If the element picked is not the original query, the these two elements are switched
				var swap = obfuscatedQuery[randomIndex];
				obfuscatedQuery[randomIndex] = obfuscatedQuery[nbFakeQueries];
				obfuscatedQuery[nbFakeQueries] = swap;
			}
			return obfuscatedQuery;
		}, 
		disjunctiveQueryToString(query){
			var queryStr = "[";
			var nbSubQueries = query.length;
			for (var idxSubQuery = 0 ; idxSubQuery < nbSubQueries ; idxSubQuery++){
				queryStr += peas_indist.queryToString(query[idxSubQuery]);
				if (idxSubQuery < (nbSubQueries - 1)){
					queryStr += ", ";
				}
			}
			queryStr += "]";
			return queryStr;
		}, 
		queryToString(query){
			var queryStr = "[";
			var nbTerms = query.length;
			for (var idxTerm = 0 ; idxTerm < nbTerms ; idxTerm++){
				var text = query[idxTerm].text;
				var weight = query[idxTerm].weight;
				var reason = query[idxTerm].reason;
				queryStr += '{"text":"' + text + '", "weight":"' + weight + '", "reason":"' + reason + '"}';
				if (idxTerm < (nbTerms - 1)){
					queryStr += ", ";
				}
			}
			queryStr += "]";
			return queryStr;
		}
	};
	return peas_indist;
});