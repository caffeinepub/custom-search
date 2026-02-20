import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";

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
    await OutCall.httpGetRequest(makeOutcallURL(searchQuery), [], transform);
  };

  public shared ({ caller }) func search(searchQuery : Text) : async Text {
    await fetchSearchResults(searchQuery);
  };
};
