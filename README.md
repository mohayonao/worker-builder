# WorkerBuilder
> WorkerBuilder builds a WebWorker from a function

## Downloads

  - [WorkerBuilder](http://mohayonao.github.io/worker-builder/worker-builder.jsj)

## API
- `constructor(func : function) : WorkerBuilder`
  - create an instance of WorkerBuilder
- `.createURL() : string`
  - create an url for Worker
- `.build() : Worker`
  - create an instance of Worker

## Examples
### Background timer

```javascript
var timer = new WorkerBuilder(function(onmessage, postMessage) {
  var t = 0;

  onmessage = function(e) {
    if (t) {
      clearInterval(t);
    }

    t = 0;

    if (typeof e.data === "number" && e.data > 0) {
      t = setInterval(function() {
        postMessage(null);
      }, e.data);
    }
  };

}).build();


timer.onmessage = function() {
  console.log("!");
};

timer.postMessage(1000);
```

### AudioWorkerNode of feature Web Audio API

```javascript
var bitcrusher_worker = new WorkerBuilder(function(onaudioprocess) {
  var phaser = 0;
  var lastDataValue = 0;

  onaudioprocess = function (e) {
    for (var channel = 0; channel < e.inputBuffers.length; channel++) {
      var inputBuffer = e.inputBuffers[channel];
      var outputBuffer = e.outputBuffers[channel];
      var bufferLength = inputBuffer.length;
      var bitsArray = e.parameters.bits;
      var frequencyReductionArray = e.parameters.frequencyReduction;

      for (var i = 0; i < bufferLength; i++) {
        var bits = bitsArray ? bitsArray[i] : 8;
        var frequencyReduction = frequencyReductionArray ? frequencyReductionArray[i] : 0.5;

        var step = Math.pow(1 / 2, bits);
        phaser += frequencyReduction;
        if (phaser >= 1.0) {
          phaser -= 1.0;
          lastDataValue = step * Math.floor(inputBuffer[i] / step + 0.5);
        }
        outputBuffer[i] = lastDataValue;
      }
    }
  };
});

var bitcrusherNode = audioContext.createAudioWorker(bitcrusher_worker.createURL(), 1, 1);

// Custom parameter - number of bits to crush down to - default 8
bitcrusherNode.addParameter( "bits", 8 );

// Custom parameter - frequency reduction, 0-1, default 0.5
bitcrusherNode.addParameter( "frequencyReduction", 0.5 );
```


## License

WorkerBuilder is available under the The MIT License.
