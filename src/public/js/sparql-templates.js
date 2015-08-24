/* Templates for SPARQL queries
 *
 * format is variant of Mustache
 * using ~{ }~ instead of {{ }}
 * (to avoid clashes in SPARQL)
 *
 * templating engine is Hogan
 * http://twitter.github.io/hogan.js/
 */

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

var commonPrefixes =
	" \n\
PREFIX schema: <http://schema.org/> \n\
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
PREFIX dc: <http://purl.org/dc/terms/> \n\
PREFIX owl: <http://www.w3.org/2002/07/owl#> \n\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
PREFIX foaf: <http://xmlns.com/foaf/0.1/> \n\
PREFIX dcat: <http://www.w3.org/ns/dcat#> \n\
PREFIX void: <http://rdfs.org/ns/void#> \n\
PREFIX bibo: <http://purl.org/ontology/bibo/> \n\
PREFIX dctype: <http://purl.org/dc/dcmitype/> \n\
PREFIX sioc: <http://rdfs.org/sioc/ns#>  \n\
PREFIX wiki: <http://purl.org/stuff/wiki#>  \n\
\n\
";

var getAllProperties = commonPrefixes +
	"SELECT DISTINCT ?property \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
?subject ?property ?object \n\
} \n\
ORDER BY ?property \n\
";

var getResourcesOfTypeSparqlTemplate = commonPrefixes +
	" \n\
SELECT DISTINCT * \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
?uri a ~{type}~ \n\
} \n\
ORDER BY ?uri \n\
";

var getPropertiesOfResource = commonPrefixes +
	" \n\
SELECT DISTINCT * \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
<~{subject}~> ?property ?object \n\
} \n\
ORDER BY ?p \n\
";

// redundant
var getClassListSparqlTemplate = commonPrefixes +
	" \n\
SELECT DISTINCT * \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
?uri a rdfs:Class; \n\
} \n\
";

var getPropertyListSparqlTemplate = commonPrefixes +
	" \n\
SELECT DISTINCT * \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
	?uri a rdf:Property; \n\
	OPTIONAL { \n\
		?uri rdfs:range ?range \n\
	} \n\
} \n\
\n\
ORDER BY ?uri";

var getResourceSparqlTemplate = commonPrefixes +
	" \n\
SELECT DISTINCT * \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
<~{uri}~> ?p ?o; \n\
} \n\
";

var deleteResourceSparqlTemplate = commonPrefixes +
	" \n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
<~{resourceURI}~> ?p ?o . \n\
}  \n\
WHERE {  \n\
<~{resourceURI}~>  ?p ?o  . \n\
}";

/*
PREFIX dc: <http://purl.org/dc/elements/1.1/>
DELETE DATA {
GRAPH <http://example/bookStore> {
<http://example/book1>  dc:title  "Fundamentals of Compiler Desing"
} } ;
*/

var deleteTurtleSparqlTemplate = commonPrefixes + " \n\
		DELETE DATA { \n\
			GRAPH <~{graphURI}~> { \n\
				 ~{turtle}~ \n\
			} \n\
		}";

var updateTripleSparqlTemplate = commonPrefixes +
	"WITH <~{graphURI}~> \n\
	DELETE { <~{subject}~> <~{predicate}~> ?object }  \n\
	WHERE {  \n\
	<~{subject}~>  <~{predicate}~> ?object  . \n\
	INSERT DATA {  \n\
		GRAPH <~{graphURI}~> {  \n\
			<~{subject}~>  <~{predicate}~> \"\"\"~{object}~\"\"\"  . \n\
}\n\
}";

/* maybe needed */
var deleteTripleSparqlTemplate = commonPrefixes +
	" \n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
<~{subject}~> <~{property}~> <~{object}~> . \n\
}  \n\
WHERE {  \n\
<~{subject}~>  <~{property}~> <~{object}~>  . \n\
}";

// ------- old foowiki queries -----------------------

var getListSparqlTemplate = commonPrefixes +
	" \n\
SELECT DISTINCT * \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
?uri \n\
dc:format ?format ; \n\
dc:created ?created ; \n\
dc:modified ?modified ; \n\
dc:title ?title ; \n\
a wiki:Page ; \n\
foaf:maker [ \n\
foaf:nick ?nick \n\
] . \n\
} \n\
";

var getPageListSparqlTemplate = getListSparqlTemplate +
	" \n\
ORDER By ?title  \n\
# LIMIT 10 \n\
";

var getRecentChangesSparqlTemplate = getListSparqlTemplate +
	" \n\
ORDER By DESC(?modified)  \n\
LIMIT 15 \n\
";

var getPageSparqlTemplate = commonPrefixes +
	"\n\
    SELECT DISTINCT * \n\
    FROM NAMED <~{graphURI}~>  \n\
    WHERE { \n\
    <~{uri}~> \n\
    dc:format ?format ; \n\
    dc:created ?created ; \n\
    dc:modified ?modified ; \n\
    dc:title ?title ; \n\
    sioc:content ?content ; \n\
    a wiki:Page ; \n\
    foaf:maker [ \n\
    foaf:nick ?nick \n\
    ] . \n\
} \n\
";

//      ?uri a ?type; \n\

var getResourcesSparqlTemplate = commonPrefixes +
	"\n\
    SELECT DISTINCT * \n\
    FROM NAMED <~{graphURI}~>  \n\
    WHERE { \n\
OPTIONAL { \n\
     ?uri   dc:title ?title  \n\
} \n\
OPTIONAL { \n\
     ?uri   dc:created ?created  \n\
} \n\
OPTIONAL { \n\
     ?uri   dc:modified ?modified  \n\
} \n\
   VALUES ?graphURI { <~{graphURI}~> } \n\
} \n\
ORDER BY ?title \n\
";

var getTurtleSparqlTemplate = commonPrefixes +
	"\n\
    CONSTRUCT { <~{uri}~>  ?p ?o } \n\
    FROM NAMED <~{graphURI}~>  \n\
    WHERE { <~{uri}~>  ?p ?o } \n\
";

var getImageSparqlTemplate = commonPrefixes +
	"\n\
    SELECT DISTINCT * \n\
    FROM NAMED <~{graphURI}~>  \n\
    WHERE { \n\
    <~{imageURI}~> a dctype:Image ; \n\
    wiki:base64 ?base64 .\n\
} \n\
";

var postImageSparqlTemplate = commonPrefixes +
	"\n\
WITH <~{graphURI}~> \n\
DELETE { <~{imageURI}~>  ?p ?o }  \n\
WHERE { <~{imageURI}~>  ?p ?o } \n\
; \n\
INSERT DATA {  \n\
GRAPH <~{graphURI}~> {  \n\
\n\
    <~{imageURI}~> a dctype:Image ; \n\
    rdfs:label \"\"\"~{imageLabel}~\"\"\" ; \n\
    wiki:base64 \"\"\"~{imageData}~\"\"\" .\n\
}  \n\
}";

// ?tag dc:topic ?topicURI .  \n\

var getAllTagsSparqlTemplate = commonPrefixes +
	"\n\
SELECT DISTINCT ?topicLabel   \n\
 FROM NAMED <~{graphURI}~>  \n\
WHERE {  \n\
    ?s dc:topic ?topicURI . \n\
    ?topicURI rdfs:label ?topicLabel .  \n\
}  \n\
";

var getTagsSparqlTemplate = commonPrefixes +
	"\n\
SELECT DISTINCT *  \n\
 FROM NAMED <~{graphURI}~>  \n\
WHERE {  \n\
	<~{uri}~>  a wiki:Page ;  \n\
	dc:topic ?topicURI .  \n\
    ?topicURI rdfs:label ?topicLabel .  \n\
}  \n\
";


var postPageSparqlTemplate = commonPrefixes +
	"\n\
WITH <~{graphURI}~> \n\
DELETE { <~{uri}~>  ?p ?o }  \n\
WHERE { <~{uri}~>  ?p ?o } \n\
; \n\
INSERT DATA {  \n\
GRAPH <~{graphURI}~> {  \n\
\n\
<~{uri}~> \n\
dc:format <~{format}~> ; \n\
dc:created \"~{created}~\" ; \n\
dc:modified \"~{modified}~\" ; \n\
dc:title \"\"\"~{title}~\"\"\" ; \n\
sioc:content  \"\"\"~{content}~\"\"\" ; \n\
a sioc:Post ; \n\
a wiki:Page ; \n\
foaf:maker <~{maker}~> . \n\
 <~{maker}~> foaf:nick \"~{nick}~\" . \n\
}  \n\
}";


var postTagsSparqlTemplate = commonPrefixes +
	"\n\
INSERT DATA {  \n\
GRAPH <~{graphURI}~> {  \n\
\n\
~{#tags}~ \n\
    <~{uri}~> dc:topic <~{topicURI}~> . \n\
     <~{topicURI}~>  rdfs:label \"~{topicLabel}~\" . \n\
  ~{/tags}~ \n\
 \n\
} \n\
}";

var searchSparqlTemplate = commonPrefixes +
	"\n\
SELECT DISTINCT *  \n\
 FROM NAMED <~{graphURI}~>  \n\
 WHERE { \n\
?uri \n\
a sioc:Post ; \n\
a wiki:Page ; \n\
dc:format ?format ; \n\
dc:created ?created ; \n\
dc:modified ?modified ; \n\
dc:title ?title ; \n\
sioc:content  ?content ; \n\
foaf:maker [ \n\
foaf:nick ?nick \n\
] . \n\
\n\
~{#tags}~ \n\
    ?uri dc:topic ?topicURI . \n\
   ?topicURI     rdfs:label \"~{topicLabel}~\" . \n\
  ~{/tags}~ \n\
\n\
         FILTER regex(CONCAT(?content, ' ', ?title), \"~{regex}~\", \"i\")  \n\
           \n\
}";

// could probably be tidier
var deleteResourceSparqlTemplate = commonPrefixes +
	"\n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
?o sioc:topic ?topic . \n\
}  \n\
WHERE {  \n\
<~{uri}~>  ?p ?o  . \n\
?o sioc:topic ?topic . \n\
} \n\
 ; \n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
<~{uri}~>  ?p ?o .   \n\
}  \n\
WHERE { <~{uri}~>  ?p ?o } \n";
