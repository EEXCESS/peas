# peas
PEAS stands for Private, Efficient and Accurate (web) Search. It is composed of two protocols: 
- an unlinkability protocol (peas_unlink): aims at hiding users identity, 
- an indistinguishability protocol (peas_indist): aims at hiding users intents by obfuscating their queries. 

## Indistinguishability

### Example

```
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
```
