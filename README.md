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
	var originalQuery = JSON.parse('{"numResults":3,"partnerList":[{"systemId":"Europeana"}],"protectedPartnerList":[{"systemId":"Wissenmedia","partnerKey":"dsajln22sadjkl!"}],"firstName":"Max","lastName":"Musterman","birthDate":1404302589436,"gender":"male","address":{"country":"testcountry","zipCode":1213345,"city":"testcity","line1":"nothing","line2":"toadd"},"userLocations":[{"longitude":10.5,"latitude":10.5,"accuracy":1.0,"timestamp":1404302589436}],"languages":[{"iso2":"de","competenceLevel":0.1},{"iso2":"en","competenceLevel":0.1}],"userCredentials":[{"systemId":"Wissenmedia","login":"me@partner.x","securityToken":"sdjalkej21!#"}],"history":[{"lastVisitTime":1402472311035,"title":"historytitle","typedCount":4,"visitCount":4,"url":"http://1234.com"}],"interests":[{"text":"text","weight":0.1,"confidence":0.1,"competenceLevel":0.1,"source":"source","uri":"http://dsjkdjas.de"},{"text":"text2","weight":0.2,"confidence":0.2,"competenceLevel":0.2,"source":"source2","uri":"http://google.de"}],"contextKeywords":[{"text":"graz","weight":0.1,"reason":"manual"},{"text":"vienna","weight":0.1,"reason":"manual"}],"contextNamedEntities":{"locations":[{"text":"graz","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"},{"text":"graz","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"}],"persons":[{"text":"MichaelJackson","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"},{"text":"BillClinton","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"}],"organizations":[{"text":"know-center","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"},{"text":"mendeley","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"}],"misc":[{"text":"something","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"},{"text":"something","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"}],"topics":[{"text":"Trees","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"},{"text":"Animal","weight":0.1,"confidence":0.1,"uri":"http://dbpedia.url.org"}]}}'); // A query in the format QF1
	var nbFakeQueries = getNumberOfFakeQueriesFromSomewhere(); // It is greater or equal to 0
	var obfuscatedQuery = peas_indist.obfuscateQuery(originalQuery, nbFakeQueries);  // This will return a query of format QF2 composed of (nbFakeQueries+1) sub-queries
	// Now you can send the obfuscated query to the privacy proxy that will process it
	// Notice that the orginal query could be send to the privacy proxy as well
});
```
