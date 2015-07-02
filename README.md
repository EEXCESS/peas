PEAS stands for Private, Efficient and Accurate (web) Search. 

It is composed of two protocols: 
- an unlinkability protocol (peas_unlink): aims at hiding users identity, 
- an indistinguishability protocol (peas_indist): aims at hiding users intents by obfuscating their queries. 

The request and response formats handled in these protocols are described [here](https://github.com/EEXCESS/documentation/blob/ResultFormatChange/json-exchange-format.md#request-and-response-formats-to-interact-with-the-privacy-proxy). 

# Installation

```bash
git clone https://github.com/EEXCESS/peas.git folderOfYourChoice
cd folderOfYourChoice/
git checkout master
bower install
```

# Indistinguishability Protocol

In its current version, the component offers 2 methods: 
- `obfuscateQuery(query, nbFakeQueries)` returns a QF2 query composed of (`nbFakeQueries`+1) sub-queries; `query` (a QF1 query) is one of these sub-queries, 
- `filterResults(results, query)` returns a RF1 result from `results` (a RF2 result); it keeps the results that are more likely to be related to `query`.

## Example of Ofuscation

```javascript
require(["peas_indist"], function(peas_indist){
	// Query of format QF1:
	var originalQuery = JSON.parse('{"numResults":3,"contextKeywords":[{"text":"graz","weight":0.1},{"text":"vienna", "weight":0.1}]}'); // A query in the format QF1
	var nbFakeQueries = getNumberOfFakeQueriesFromSomewhere(); // It is greater or equal to 0
	// Query of format QF2:
	var obfuscatedQuery = peas_indist.obfuscateQuery(originalQuery, nbFakeQueries);  // Returns a query composed of (nbFakeQueries+1) sub-queries
	// Now you can send the obfuscated query to the privacy proxy that will process it
	// Notice that the orginal query could be send to the privacy proxy as well
});
```

## Example of Filtering

```javascript
require(["peas_indist"], function(peas_indist){
	// Query of format QF1:
	var originalQuery = JSON.parse('{"numResults":3,"contextKeywords":[{"text":"graz","weight":0.1},{"text":"vienna", "weight":0.1}]}'); 
	// Query of format QF2: 
	var obfuscatedQuery = JSON.parse('{"numResults":3,"contextKeywords":[[{"text":"graz","weight":0.1},{"text":"vienna","weight":0.1}],[{"text":"music","weight":0.1},{"text":"bass","weight":0.1}],[{"text":"money","weight":0.1},{"text":"euro","weight":0.1}]]}'); 
	// Results of format RF2:
	var results = JSON.parse('{"result":[[{"documentBadge":{"provider":"Europeana","id":"/2022365/Bristol_20Museums_2C_20Galleries_20_26_20Archives_emu_ecatalogue_britisharchaeology_167417","uri":"http://europeana.eu/resolve/record/2022365/Bristol_20Museums_2C_20Galleries_20_26_20Archives_emu_ecatalogue_britisharchaeology_167417"},"title":"Rebec (musical instrument bridge)."},{"documentBadge":{"provider":"ZBW","id":"10010759886","uri":"http://www.econbiz.de/Record/10010759886"},"description":"Sampling poses an interesting problem in markets with experience goods. Free samples reveal product quality and help consumers to make informed purchase decisions (promotional effect). However, sampling may also induce consumers to substitute purchases with free consumption (displacement effect). We study this trade-o_ in the market for digital music where consumers can sample the quality of songs by watching free music videos online. Identification comes from a natural experiment in Germany, where virtually all videos that contain music are blocked on a popular video platform due to a legal dispute with representatives of the rights-holders. We show that promotional and displacement effects cancel out in the sales performance of individual songs, whereas online music videos trigger sales of albums.","title":"Video Killed the Radio Star? Online Music Videos and Digital Music Sales"},{"documentBadge":{"provider":"Deutsche Digitale Bibliothek","id":"PBUD5Y2OVZF3HNP25AA7ONG7EPM2YPS3","uri":"https://www.deutsche-digitale-bibliothek.de/item/PBUD5Y2OVZF3HNP25AA7ONG7EPM2YPS3"},"title":"Bass"}],[{"documentBadge":{"provider":"Europeana","id":"/92070/BibliographicResource_1000126223366","uri":"http://europeana.eu/resolve/record/92070/BibliographicResource_1000126223366"},"title":"Kirche der Barmh. Schwestern zur unbefleckten Empfängniss, Graz"},{"documentBadge":{"provider":"mendeley","id":"d865ace7-c12d-3b8c-aff8-8028379bf360","uri":"http://www.mendeley.com/research/qualitative-approach-assessing-body-compartments-using-bioelectrical-variables"},"title":"A qualitative approach to assessing body compartments using bioelectrical variables."},{"documentBadge":{"provider":"mendeley","id":"ec3daa22-5e1b-3182-b896-f56aeac9d552","uri":"http://www.mendeley.com/research/avifauna-vienna-atlas-breeding-birds"},"title":"The avifauna of Vienna: atlas of breeding birds."}],[{"documentBadge":{"provider":"Wissenmedia","id":"sl23364560","uri":"http://service.wissens-server.com/wissensserver/view.html?a=t&r=CURRENT&i=sl23364560&s=BEP&v=eexcess&w=EEXCESS"},"description":"Inside MoneyInside Money [ɪnˈsaɪd ˈmʌnɪ, englisch], Innengeld.","title":"Inside Money"},{"documentBadge":{"provider":"Deutsche Digitale Bibliothek","id":"MF67M5D6BSRPOFFUISVNMTVWSWJWFFRP","uri":"https://www.deutsche-digitale-bibliothek.de/item/MF67M5D6BSRPOFFUISVNMTVWSWJWFFRP"},"title":"Walker, Francis: Money"},{"documentBadge":{"provider":"Europeana","id":"/2022374/Manchester_20Museum_mm_emu_ecatalogue_humanities_98449","uri":"http://europeana.eu/resolve/record/2022374/Manchester_20Museum_mm_emu_ecatalogue_humanities_98449"},"title":"1 euro"}]],"totalResults":9,"provider":"federated"}');
	// Results of format RF1
	var filteredResults = peas_indist.filterResults(results, originalQuery);
});
```

## JSON formats

The indistinguishability protocol considers a co-occurrence graph of terms. In such a graph, vertices are terms and edges are frequencies. 
