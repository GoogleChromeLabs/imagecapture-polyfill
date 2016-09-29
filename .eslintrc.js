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
    "no-negated-condition": "warn"
  },
  "globals": {
    "document": false,
    "DOMException": false,
    "navigator": false,
    "Polymer": false,
    "window": false
  }
};
