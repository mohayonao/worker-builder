(function() {
  "use strict";

  function WorkerBuilder(func) {
    if (typeof func !== "function") {
      throw new TypeError(
        "Failed to construct 'WorkerBuilder': The 1st argument requires a function."
      );
    }

    var functionBody = func.toString().trim().match(
      /^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/
    )[1];

    function createURL() {
      return URL.createObjectURL(new Blob([ functionBody ], { type: "text/javascript" }));
    }

    function build() {
      return new Worker(createURL());
    }

    return { createURL: createURL, build: build };
  }

  window.WorkerBuilder = WorkerBuilder;

})();
