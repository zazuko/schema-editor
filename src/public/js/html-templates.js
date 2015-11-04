/* Templates for HTML blocks
 *
 * format is variant of Mustache
 * using ~{ }~ instead of {{ }}
 * (to avoid clashes in SPARQL, not actually relevant here)
 *
 */

 /**
  * Property Description Template
  */
 var propertyTemplate = " \n\
 <label>Property</label> \n\
 <input class="resource" value="~{propertyName}~" /> \n\
 \n\
  <label>rdfs:subPropertyOf</label> \n\
  <input class="resource" value="~{subPropertyOf}~" /> \n\
\n\
 <label>rdfs:domain</label> \n\
 <input value="~{domain}~" class="resource" /> \n\
\n\
 <label>rdfs:range</label> \n\
 <input value="~{range}~" class="resource" /> \n\
\n\
 <div class="fieldBlock"> \n\
   <label>rdfs:label</label> \n\
   <input class="propertyLabel" class="literal" /> \n\
   <button class="langButton"></button> \n\
 </div> \n\
 <button class="plusButton">+</button> \n\
\n\
 <div class="fieldBlock"> \n\
   <label>rdfs:comment</label> \n\
   <textarea class="propertyComment" rows="4" cols="75" class="literal"></textarea> \n\
   <button class="langButton"></button> \n\
 </div> \n\
 <button class="plusButton">+</button> \n\
";

/**
 * Class Description Template
 * TODO is needed?
 */
var classTemplate = " \n\
<label for="~{classNameID}~">Class Name</label> \n\
<input id="~{classNameID}~" value="~{className}~" /> \n\
\n\
<label for="~{subClassOfID}~">rdfs:subClassOf</label> \n\
<input id="~{subClassOfID}~" class="resource" value="~{className}~" /> \n\
\n\
<div class="fieldBlock"> \n\
  <label>rdfs:label</label> \n\
  <input class="classLabel" value="~{className}~" /> \n\
  <button class="langButton"></button> \n\
</div> \n\
<button class="plusButton">+</button> \n\
\n\
<div class="fieldBlock"> \n\
  <label>rdfs:comment</label> \n\
  <textarea class="classComment" rows="4" cols="75" title="Enter human-readable description">~{classComment}~</textarea> \n\
  <button class="langButton"></button> \n\
</div>\n\
<button class="plusButton">+</button>\n\
            ";
