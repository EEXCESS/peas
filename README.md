# PEAS
PEAS stands for Private, Efficient and Accurate (web) Search. It is composed of two protocols: 
- an unlinkability protocol (peas_unlink): aims at hiding users identity, 
- an indistinguishability protocol (peas_indist): aims at hiding users intents by obfuscating their queries. 

## Indistinguishability

### Features

In its current version, the component offers only 3 basic features: 
- `obfuscateQuery(query, nbFakeQueries)` create a disjunctive query made of `query` and `nbFakeQueries` fake queries, 
- `disjunctiveQueryToString(query)` transforms a disjunctive query `query` to a string, 
- `queryToString(query)` transforms a query `query` to a string. 

### Example

```javascript
require(["peas_indist"], function(peas_indist){
	var originalQuery = JSON.parse('[{"text":"graz","weight":0.1},{"text":"vienna","weight":0.2}]'); // In this version the query is the contextKeywords field
	var nbFakeQueries = getNumberOfFakeQueriesFromSomewhere(); // It is greater or equal to 0
	var obfuscatedQuery = peas_indist.obfuscateQuery(originalQuery, nbFakeQueries);  // This will return a query composed of (nbFakeQueries+1) sub-queries
	// Now you can send the obfuscated query to the privacy proxy that will process it
	// Notice that the orginal query could be send to the privacy proxy as well
});
```
