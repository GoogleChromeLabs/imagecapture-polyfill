module.exports = {
  "extends": "google",
  "rules": {
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never"
      }
    ],
    "no-negated-condition": "warn",
    "spaced-comment": ["error", "always", { "exceptions": ["/"] }]
  },
  "globals": {
    "document": false,
    "DOMException": false,
    "MediaStream": false,
    "navigator": false,
    "Polymer": false,
    "URL": false,
    "window": false
  }
};
