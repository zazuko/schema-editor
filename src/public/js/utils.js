/* TODO move into a module, hyperdata-utils?

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

/* Forces refresh of columns
 * fixes non-intuitive problem with post-Ajax redrawing
 */
function refresh() {
    var elem = document.getElementById("wrapper");
    elem.style.display = 'none';
    elem.offsetHeight; // no need to store this anywhere, the reference is enough
    elem.style.display = 'flex';
    refreshResourceInput();
}

/* was to be regex-based way of tweaking turtle-sparql to valid sparql */
function cleanSPARQL(sparql) {
    // BASE    <http://example.org/book/>
    var baseRe = /@base.*>\s.*/gi;
    var match = sparql.match(baseRe);
    sparql = sparql.replace(baseRe, "");
    if(match && match[0]) {
        var sparqlBase = "BASE " + match[0].substring(5, match[0].length - 1);
        sparql = sparqlBase + "\n" + sparql;
    }

    var prefixRe = /@prefix.*>\s.*/gi;
    var matches = sparql.match(prefixRe);
    console.log("reg array = " + JSON.stringify(matches, false, 4));
    var noPrefixSparql = sparql.replace(prefixRe, "");
    var prefixes = "";
    for(var i = 0; i < matches.length; i++) {
        var trimmed = matches[i].substring(1, matches[i].length - 1);
        prefixes = prefixes + trimmed + "\n";
    }
    sparql = prefixes + noPrefixSparql;
    console.log("cleaned sparql = \n" + sparql);
    return sparql;
}

function turtleToNtriples(turtle, handleNtriples) {
    var parser = N3.Parser();
    parser.parse(turtle,
        function (error, triple, prefixes) {
            if(triple)
                console.log(triple.subject, triple.predicate, triple.object, '.');
            else
                console.log("# That's all, folks!", prefixes)
        });
}

function refreshResourceInput() {
    var resourceInput = $("#resource");
    if(resourceInput.val()) { // may not be defined
        resourceInput.attr('size', resourceInput.val().length);
    }
}

function spinner() {
    var $loading = $('#spinner').hide();
    $.ajaxSetup({
        beforeSend: function () {
            $('#spinner').show();
        },
        complete: function () {
            $('#spinner').hide();
        },
        success: function () {}
    });
}

// bit of a sledgehammer, but whatever works...
Array.prototype.contains = function (obj) {
    var i = this.length;
    while(i--) {
        if(this[i] == obj) {
            return true;
        }
    }
    return false;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
/* TODO is used? */
function setupErrorHandling() {
    $("#errorbox").hide();
    $("#errorbox").click(function () {
        // $("#errorbox").toggle(500);
        $("#errorbox").hide();
    });

    $.ajaxSetup({
        error: function (x, status, error) {
            $("#errorbox").text(status + ": " + error);
            $("#errorbox").toggle(500);
            // $("#errorbox").toggle(2000);
        }
    });
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function sparqlTemplater(raw, replacementMap, isWrite) {
    if(isWrite && replacementMap["content"]) {
        replacementMap["content"] = escapeLiterals(replacementMap["content"]);

    }
    return templater(raw, replacementMap);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function unescapeLiterals(text) {
    var data = text.replace(/&#34&#34&#34/g, '"""');
    return data;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function escapeLiterals(text) {
    return text.replace(/"""/g, "&#34&#34&#34");
}


/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function templater(raw, replacementMap) {
    var template = Hogan.compile(raw, {
        delimiters: '~{ }~'
    });

    var result = template.render(replacementMap);
    return htmlUnescape(result);
}

/* parse URL */
var queryString = (function (a) {
    if(a == "") return {};
    var b = {};
    for(var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if(p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function getCurrentPageURI() {
    return encodeURI(queryString["uri"]);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function translateLinks(object) {
    $('div.content  a', object).each(
        function () {
            var href = this.href;
            console.log("HREF=" + href);
            if(href.indexOf(FooWiki.serverRootPath) != -1) { // less than perfect, in-page links maybe involve FooWiki.pagesBaseURI
                var hashPosition = href.indexOf("#");
                if(hashPosition != -1) {
                    var anchor = href.substring(hashPosition); // "#Something"
                    anchor = anchor.trim().toLowerCase();
                    anchor = anchor.replace(/\s+/g, "-");
                    this.href = href.substring(0, hashPosition) + anchor;

                    $(this).click(function () {
                        $('html, body').animate({
                            scrollTop: $(anchor).offset().top
                        }, 250); // milliseconds
                    });
                } else {
                    // http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/Home%20Page
                    this.href = reviseHref(this);
                }
                return;
            }
        });

    $("img", object).each(function () {
        //  var split = window.location.href.split("/");
        //    var path = split.slice(0, split.length - 1).join("/");
        //     path = path + "/" + $(this).attr("src") + "&type=image";
        // $(this).attr("src", path);


        var path = FooWiki.pagesBaseURI + $(this).attr("src");
        var me = this;
        var setImgSrc = function (src) {
            console.log("SRC=" + src);
            $(me).attr("src", src);
        }
        getImage(path, setImgSrc);
    });

    // somethin similar for handlin img 404s
    // 1unnamed.jpg =>
    //  http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/1unnamed.jpg&type=image
    /*
              $('div.content  img', object).each(
                function () {
                    var src = $(this).attr("src");
                //    console.log("this.src="+$(this).attr("src"));
                    var newSrc = FooWiki.serverRootPath+"page.html?uri="+FooWiki.pagesBaseURI+src+"&type=image";
                  $(this).attr("src",newSrc);
                });
                */
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function reviseHref(aElement) {
    var oldHref = aElement.href;

    //   if (!aElement.text && (location.href == aElement.href)) { // both blank, insert index link
    //        aElement.text = "Home Page";
    //   }

    var linkText = aElement.text;
    //    console.log("OFFSITEx"+linkText);
    if(linkText) {
        //   console.log("OFFSITEx"+linkText);
        if(aElement.href.indexOf(FooWiki.serverRootPath) == -1) { // off site, less than perfect BROKEN
            //      console.log("OFFSITE");
            $(aElement).append(aElement.href); // use link as label
            return;
        }
        if(location.href == oldHref) { // link href was blank
            var before = window.location.protocol + "//" + window.location.hostname +
                ":" + window.location.port + FooWiki.serverRootPath + "page.html?uri=" +
                FooWiki.pagesBaseURI;
            return oldHref.substring(0, before.length) + linkText;
        } else {
            var localRef = oldHref.substring(oldHref.indexOf(FooWiki.serverRootPath) +
                FooWiki.serverRootPath.length);
            return FooWiki.serverRootPath + "page.html?uri=" + FooWiki.pagesBaseURI +
                localRef;
        }
    }
    includeContent(aElement);
    return;


}

function redirectTo(target) {
    window.location.href = target;
    return false;
}


/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function includeContent(aElement) {

    var oldHref = aElement.href;
    var localRef = oldHref.substring(oldHref.indexOf(FooWiki.serverRootPath) +
        FooWiki.serverRootPath.length);
    //   var uri = FooWiki.serverRootPath + "page.html?uri=" + FooWiki.pagesBaseURI + localRef;
    var uri = FooWiki.pagesBaseURI + localRef;


    //  $(aElement).append("filler");
    console.log("REF=" + aElement.href);

    var handler = function (pageMap, entryJSON) { // entryHandler(pageMap, entryJSON);
        //        console.log("pageMap=" + JSON.stringify(pageMap));
        //        console.log("CONTEN=" + JSON.stringify(entryJSON));
        if(entryJSON && entryJSON[0] && entryJSON[0]["content"]) {
            var content = formatContent(entryJSON[0]["content"]);
        } else {
            content = "<em>**undefined link**</em>";
        }

        $(aElement).replaceWith(content);
    }

    console.log("uri=" + uri);
    getResource(uri, handler);

}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
// little workaround for odd marked.js behaviour, at least in part due to marked.js line 793 regex
// if the header is a link, the id ends up as "-like-this-like-this-"
function fixHeaderIDs() {
    $(
        ".content h1, .content h2, .content h3, .content h4, .content h5, .content h6"
    ).each(function () {
        var id = $(this).attr("id");
        if(id) {
            var length = id.length;
            if(id[0] == "-" && id[length - 1] == "-") {
                //      console.log("need to fix");
                id = id.substring(1, length / 2);
                $(this).attr("id", id);
            }
            //    console.log("ID = " + id);
        }
    });
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function escapeXml(markup) {
    markup = markup.replace(/&/g, "&amp;");
    markup = markup.replace(/</g, "&lt;");
    markup = markup.replace(/>/g, "&gt;");
    //  markup = escapeLiterals(markup);
    return markup;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function tweakBlockquotes(content) {
    var blockquoteSplit = content.split("```");
    if(blockquoteSplit.length > 1) {
        for(var i = 1; i < blockquoteSplit.length; i = i + 2) {
            //    console.log("X=" + blockquoteSplit[i]);
            blockquoteSplit[i] = hUnescape(blockquoteSplit[i]);
        }
    }
    return blockquoteSplit.join("```");
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function htmlUnescape(value) {

    value = value.replace(/&lt;/g, "<");
    value = value.replace(/&gt;/g, ">");
    value = value.replace(/&quot;/g, "\"");
    value = value.replace(/&amp;/g, "&");

    return value;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function hUnescape(value) {

    var d = $("<div>");
    d.html(value);
    return d.text();
}

// from http://blog.stevenlevithan.com/archives/parseuri
// see also : https://web.archive.org/web/20140312145937/http://stevenlevithan.com/demo/parseuri/js
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri(str) {
    var o = parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while(i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

/* jQuery logging utility
usage : e.g. $("#thing").log()
found via http://stackoverflow.com/questions/13974740/how-do-i-console-log-a-jquery-dom-element-in-chrome
*/
$.fn.log = function (max) {
    max = (max == null ? 15 : Math.max(max, 0));

    var arr = this.slice(0, max).toArray();

    for(var i = 1; i < arr.length; i += 2) {
        arr.splice(i, 0, ",");
    }

    arr.unshift("<jQuery> length %".replace("%", this.length), "[");

    if(this.length > max) {
        if(max > 0) {
            arr.push(",");
        }
        arr.push("(% more)".replace("%", this.length - max));
    }

    arr.push("]");

    console.log.apply(console, arr);

    return this;
};
