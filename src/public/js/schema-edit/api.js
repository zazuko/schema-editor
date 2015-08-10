var PublicModule = (function() {
  "use strict";

  // This is the public interface of the Module.
  var Module = {
    // publicFunction can be called externally
    publicFunction: function() {
      return "publicFunction can be invoked "
                  + "externally but "
                  + privateFunction();
     }

     ## API, based on spec

     setEndpoint(URL){
       return graphURI;
     }

     listClasses(graphURI) {
         var classes = [];
         return classes;
     }

     listPropertiesForClass(graphURI, classURI) {
         var properties = [];
         return properties;
     }

     listClassesForProperty(graphURI, propertyURI) {
         var classes = [];
         return classes;
     }

     listProperties(graphURI) {
         var properties = [];
         return properties;
     }

     /*
     naive ntriples-based CONSTRUCT logging/diff for now
     sparqlLog.add
     sparqlLog.takeSnapshot
     sparqlLog.diff(snapshotBefore, snapshotAfter)
     */

  };

  // privateFunction is completely hidden
  // from the outside.
  function privateFunction() {
     return "privateFunction cannot";
  }

  return Module;
}());
