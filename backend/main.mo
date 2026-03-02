import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeOutcallURL(searchQuery : Text) : Text {
    let baseURL = "https://api.duckduckgo.com/?q=";
    let modifiers = "&format=json&pretty=1&no_redirect=1&no_html=1&skip_disambig=1";
    baseURL # searchQuery # modifiers;
  };

  // Returns JSON for search results.
  public shared ({ caller }) func fetchSearchResults(searchQuery : Text) : async Text {
    let url = makeOutcallURL(searchQuery);
    let result = await OutCall.httpGetRequest(url, [], transform);
    if (result.contains(#text("Network error: HTTP request returned status code 0"))) {
      Runtime.trap(
        "DuckDuckGo HTTP outcall failed. Please check your node provider settings (ccfi-cli node-provider list). " #
        "Current node provider address is not authorized for HTTP outcalls. " #
        "You need to select a node provider that enables HTTP outcalls. " #
        "This feature is generally available only in production scenarios due to cost factors."
      );
    } else {
      result;
    };
  };

  public shared ({ caller }) func search(searchQuery : Text) : async Text {
    await fetchSearchResults(searchQuery);
  };
};
