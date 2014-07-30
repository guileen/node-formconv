var expect = require('expect.js')
var scheme = require('../scheme')

describe('userScheme', function(){
    var userModel = scheme({
        nick: /\w{3,18}/,
        password: {type: String, private: true},
        birth: Date,
        height: Number,
        reqDate: {type: Date, required: true, default: function(obj) {return new Date()}},
        reqString: {type: String, required: true},
        reqNumber: {type: Number, required: true}
    })

    it('should normalize object', function() {
        var src = {
          nick: 'asd',
          password: 'pass',
          birth: '2014-05-06',
          reqDate: null,
          reqString: 'abcde',
          reqNumber: '50',
          nonExist: 'not exists'
        }
        obj = userModel.normalize(src)
        console.log(obj)
        expect(obj.nick).to.be.a('string')
        expect(obj.password).to.be.a('string')
        expect(obj.birth).to.be.a(Date)
        expect(obj.height).to.be(undefined)
        expect(obj.nonExist).to.be(undefined)
        expect(obj.reqDate).to.be.a(Date)
        expect(obj.reqNumber).to.be.a('number')
    })

    it('should filter object', function() {
        var src = {
          nick: 'asd',
          password: 'pass',
          birth: new Date('2014-05-06'),
          reqDate: new Date('1998-01-01'),
          reqString: 'abcde',
          reqNumber: 50,
          nonExist: 'not exists'
        }
        var obj = userModel.filter(src)
        console.log(obj)
        expect(obj.nick).to.be.ok()
        expect(obj.birth).to.be.ok()
        expect(obj.height).to.be(undefined)
        expect(obj.reqDate).to.be.ok()
        expect(obj.reqString).to.be.ok()
        expect(obj.nonExist).to.be(undefined)
        expect(obj.password).to.be(undefined)
    })
})