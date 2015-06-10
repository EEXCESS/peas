require(["peas_indist"], function(peas_indist){
	
	document.getElementById("go").addEventListener("click", function(){ 
		var originalQuery = JSON.parse(document.getElementById("originalQuery").value);
		var nbFakeQueries = document.getElementById("nbFakeQueries").value;
		if (originalQuery != ""){
			var obfuscatedQueryStr;
			if (nbFakeQueries <= 0){
				obfuscatedQueryStr = peas_indist.queryToString(originalQuery);
			} else {
				var obfuscatedQuery = peas_indist.obfuscateQuery(originalQuery, nbFakeQueries);
				obfuscatedQueryStr = peas_indist.disjunctiveQueryToString(obfuscatedQuery);
			}
			document.getElementById("obfuscatedQuery").innerHTML = obfuscatedQueryStr;
		}
	});
	
});