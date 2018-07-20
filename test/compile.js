const compile = require('./../lib/compile.js');
const should = require('chai').should();


describe('compile tests', function () {
    it('test case 1', function () {
        const en = compile.encrypto('TqfyUyiY6SVzDMvvsV9k', 0, 16);
        compile.decrypto(en, 0, 16).should.equal('TqfyUyiY6SVzDMvvsV9k');
    })
});