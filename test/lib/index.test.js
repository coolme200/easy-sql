var should = require('should');
var path = require('path');
var easysql = require('../../lib');

describe('lib/index.js', function () {

  var options = {sqlPool: path.resolve(__dirname, '../sqls')};

  it('init', function (done) {
    easysql.init(options);
    done();
  });

  it('one', function (done) {
    var back = easysql.one('test');    
    back.should.eql(' select col1 as b, col2 as c from table ; ');
    done();
  });
  
  it('multi', function (done) {
    var back = easysql.multi('test', options);    
    back.length.should.eql(1);
    back[0].should.eql(' select col1 as b, col2 as c from table ');
    done();
  });

  it('dynamic', function (done) {
    var back = easysql.dynamic('map.test', {a: 1}, options);
    back.should.eql(' select col1 as b, col2 as c from table where 1 = 1 and a = :a ; ');
    done();
  });

  it('dynamicMulti', function (done) {
    var back = easysql.dynamicMulti('map.test', {a: 1}, options);
    back.length.should.eql(1);
    back[0].should.eql(' select col1 as b, col2 as c from table where 1 = 1 and a = :a ');
    done();
  });

});