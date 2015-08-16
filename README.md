# operation-queue

## API

#### `var OperationQueue = require('operation-queue');`

#### `var queue = new OperationQueue()`

Create a new operation queue.

#### `queue.push(fn, [cb])`

Enqueue operation `fn`, optionally calling `cb` on completion. `fn` will receive a single callback as an argument, which in turn expects arguments `(err, res)`.

#### `queue.close([cb])`

Close the queue, optionally calling `cb` when the close operation is complete, by first waiting for any in-progress operation to complete. Any further remaining items in the queue will have their callbacks invoked with an error.