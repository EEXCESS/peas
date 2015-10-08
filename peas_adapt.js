/** 
 * @module peas_adapt
 * @requires jquery
 */
//define(["up/profile", "up/constants"], function (profile, cst) {
define([], function () {
	
	
	//************
	//** Module **
	//************
	
	var peas_adapt = {
			
			/**
			 * TODO
			 * @method adaptQuery
			 * @param {JSONObject} query A query of format QF1.
			 * @return {JSONObject} A query of format QF1. 
			 */			
			adaptQuery(query, policy){
				var adaptedQuery = query;
				
				return adaptedQuery;
			}
	};
	
	/*function cleanQuery(query){
		var cleanedQuery = query;
		delete cleanedQuery.firstName;
		delete cleanedQuery.lastName;
		delete cleanedQuery.address;
		delete cleanedQuery.gender;
		delete cleanedQuery.birthDate;
		delete cleanedQuery.languages;
		delete cleanedQuery.interests;
		return cleanedQuery;
	}*/
	
	/*function skill2level(skill){
		var idx = null;
		var i = 0;
		var length = cst.TAB_LANGUAGE_SKILLS.length; 
		var found = false;
		while ((i < length) && (!found)){
			found = (cst.TAB_LANGUAGE_SKILLS[i] == skill);
			if (found){
				idx = (length - i) / length;
				idx = Math.round(idx * 100) / 100;
			}
			i++;
		}
		return idx;
	}*/
	
	return peas_adapt;
});