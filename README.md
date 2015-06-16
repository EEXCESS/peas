# PEAS
PEAS stands for Private, Efficient and Accurate (web) Search. It is composed of two protocols: 
- an unlinkability protocol (peas_unlink): aims at hiding users identity, 
- an indistinguishability protocol (peas_indist): aims at hiding users intents by obfuscating their queries. 

## Indistinguishability

### Example

```javascript
require(["peas_indist"], function(peas_indist){
	var originalQueryString = getQueryFromSomewhere(); // The original is a string representing a JSON object
	var originalQuery = JSON.parse(originalQueryString); // Now the query is a proper JSON object
	var nbFakeQueries = getNumberOfFakeQueriesFromSomewhere(); // It is greater or equal to 0
	var obfuscatedQuery = peas_indist.obfuscateQuery(originalQuery, nbFakeQueries);  // This will return a query composed of (nbFakeQueries+1) sub-queries
	// Now you can send the obfuscated query to the privacy proxy that will process it
	// Notice that the orginal query could be send to the privacy proxy as well
});
```
