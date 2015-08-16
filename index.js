module.exports = OperationQueue;

var S_READY		= 1,
	S_BUSY		= 2,
	S_CLOSING	= 3,
	S_CLOSED	= 4;

var CANCELLED = OperationQueue.CANCELLED = {};

function OperationQueue() {
	this._jobs = [];
	this._state = S_READY;
	this._onClose = null;
}

OperationQueue.prototype.push = function(fn, cb) {
	if (this._state > S_BUSY) {
		setTimeout(function() { cb(new Error(CANCELLED)); }, 0);
	} else {
		this._jobs.push(fn, cb);
		if (this._state === S_READY) {
			this._drain();
		}
	}
}

OperationQueue.prototype.close = function(cb) {
	if (this._state === S_READY || this._state === S_CLOSED) {
		this._state = S_CLOSED;
		cb && setTimeout(cb, 0);
		return;
	} else if (this._state === S_BUSY) {
		this._state = S_CLOSING;
		this._onClose = [];
	}
	cb && this._onClose.push(cb);
}

OperationQueue.prototype._drain = function() {
	var self = this;
	this._state = S_BUSY;
	(function _next() {
		var op = self._jobs.shift(), cb = self._jobs.shift();
		op(function() {
			cb && cb.apply(null, arguments);
			if (self._state === S_CLOSING) {
				while (self._jobs.length) {
					var _ = self._jobs.shift(), cancel = self._jobs.shift();
					cancel && cancel(CANCELLED);
				}
				self._state = S_CLOSED;
				self._onClose.forEach(function(fn) { fn(); });
			} else if (self._jobs.length) {
				_next();
			} else {
				self._state = S_READY;
			}
		});
	})();
}
