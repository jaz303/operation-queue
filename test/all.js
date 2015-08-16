var OQ = require('../');
var test = require('tape');

test("serial execution", function(assert) {

    assert.plan(1);

    var q = new OQ();
    var out = '';

    q.push(function(done) { setTimeout(function() { out += 'a'; done(); }, 0); });
    q.push(function(done) { setTimeout(function() { out += 'b'; done(); }, 0); });
    q.push(function(done) { setTimeout(function() { out += 'c'; done(); }, 0); });
    q.push(function(done) {
        setTimeout(function() {
            assert.equal(out, 'abc');
            done();
        }, 0);
    });

});

test("callback fires", function(assert) {

    assert.plan(3);

    var q = new OQ();
    var x = 0;

    q.push(
        function(done) {
            setTimeout(function() {
                x = 1;
                done(null, 10);
            }, 0);
        },
        function(err, res) {
            assert.equal(err, null);
            assert.equal(res, 10);
            assert.equal(x, 1);
        }
    );

});

test("cancellation cancels remaining operations", function(assert) {

    assert.plan(5);

    var q = new OQ();
    var out = '';

    q.push(function(done) {
        setTimeout(function() {
            out += 'a';
            done();
        }, 200);
    });

    q.push(function(done) {
        setTimeout(function() {
            out += 'b';
            done();
        }, 0);
    }, function(err, val) {
        assert.ok(err);
        assert.equal(err, OQ.CANCELLED);
    });

    q.push(function(done) {
        setTimeout(function() {
            out += 'c';
            done();
        }, 0);
    }, function(err, val) {
        assert.ok(err);
        assert.equal(err, OQ.CANCELLED);
    });

    q.close(function() {
        assert.equal(out, 'a');
    });

});

test("pushing function to cancelled queue is not run", function(assert) {

    assert.plan(5);

    var q = new OQ();
    var out = '';

    q.push(function(done) {
        setTimeout(function() {
            out += 'a';
            done();
        }, 0);
    });

    q.close(function() {
        assert.equal(out, 'a');
    
        var c2 = false;
        q.push(function(done) {
            setTimeout(function() {
                c2 = true;
                done();
            }, 0); 
        }, function(err) {
            assert.notOk(c2);
            assert.equal(err, OQ.CANCELLED);
        });
    });

    var c1 = false;
    q.push(function(done) {
        setTimeout(function() {
            c1 = true;
            done();
        }, 0); 
    }, function(err) {
        assert.notOk(c1);
        assert.equal(err, OQ.CANCELLED);
    });

});