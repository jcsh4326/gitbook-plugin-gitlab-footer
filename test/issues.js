const issues = require('./../lib/gitlab/issues.js');
const should = require('chai').should();

describe('issues tests', function () {
    it('test case 1', function () {
        const url = issues.issues('http://git.d.com', 'a', 'api').withProject(120).withState('opened').url;
        url.should.equal('http://git.d.com/api/projects/120/issues?state=opened');
    });
    it('test case 2', function () {
        const url = issues.issues('http://git.d.com', 'a', 'api').withProject(120).url;
        url.should.equal('http://git.d.com/api/projects/120/issues');
    });
    it('test case 3', function () {
        const url = issues.issues('http://git.d.com', 'a', 'api').withState('opened').url;
        url.should.equal('?state=opened');
    });
    it('test case 4', function () {
        const res = issues.issues('http://git.d.com', 'Tqk', 'api/v4').withProject(230).withState('opened').request().get('issues');
        res.should.equal('{"message":"401"}');
    });
    it('test case 5', function () {
        const url = issues.issues('http://git.d.com', 'a', 'api').withs({a:'b',c:'d'}).url;
        url.should.equal('?a=b&c=d');
    });
})