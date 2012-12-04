importPackage(java.io);
importPackage(java.lang);
importPackage(java.net);
importPackage(com.google.appengine.api.urlfetch);

var httpget = function(url) {
    var url = new URL(url);

    var options = com.google.appengine.api.urlfetch.FetchOptions.Builder.withDeadline(30.0);

    var urlFetchService = URLFetchServiceFactory.getURLFetchService();
    var request = new HTTPRequest(url, HTTPMethod.GET, options)
    var response = urlFetchService.fetch(request)

    var content = new java.lang.String(response.getContent())

    return content

    /*
    var uri = new URI(url.getProtocol(), url.getHost(), url.getPath(), url.getQuery(), null);
    url = uri.toURL()
    */

    // Get the response
    var answer = new StringBuffer();
    var reader = new BufferedReader(new InputStreamReader(url.openStream()));
    var line;
    while ((line = reader.readLine()) != null) {
        answer.append(line);
    }
    reader.close();
    return answer.toString();
};

exports = httpget;
