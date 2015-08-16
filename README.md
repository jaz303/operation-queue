# operation-queue

Queue asynchronous operations for serial execution with optional completion callbacks. At any point the queue can be cancelled. When cancelled, the queue will a) wait for any pending operation to complete and b) fire the callbacks of all other pending jobs, indicating that the operations were cancelled. If any new operation is added to a cancelled queue its callback will also be invoked asynchronously indicating that it was cancelled.

## API

#### `var OperationQueue = require('operation-queue');`

#### `var queue = new OperationQueue()`

Create a new operation queue.

#### `queue.push(fn, [cb])`

Enqueue operation `fn`, optionally calling `cb` on completion. `fn` will receive a single callback as an argument that you must call to indicate that the opearation is complete; any arguments will be forwarded to your own callback.

#### `queue.close([cb])`

Close the queue, optionally calling `cb` when the close operation is complete, by first waiting for any in-progress operation to complete. Any further remaining items in the queue will have their callbacks invoked with the value `OperaionQueue.CANCELLED`.

## License

ISC