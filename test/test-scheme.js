var expect = require('expect.js')
var scheme = require('../scheme')

describe('userScheme', function(){
    var userModel = scheme({
        nick: /\w{3,18}/,
        password: {type: String, private: true},
        birth: Date,
        height: Number,
        isBoy: Boolean,
        isGirl: Boolean,
        reqDate: {type: Date, required: true, default: function(obj) {return new Date()}},
        reqString: {type: String, required: true},
        reqNumber: {type: Number, required: true},
        obj1: {type:Object, private: true},
        array: Array,
        array1: Array,
        array2: Array
    })

    it('should normalize object', function() {
        var src = {
          nick: 'asd',
          password: 'pass',
          birth: '2014-05-06',
          reqDate: null,
          isBoy: '1',
          isGirl: 'false',
          reqString: 'abcde',
          reqNumber: '50',
          obj1: '{"hello":"world"}',
          array: [1,2,3],
          array1: '[1, 2, 3]',
          array2: '1, 2, 3',
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
        expect(obj.obj1.hello).to.be('world')
        expect(obj.array).to.be.a(Array)
        expect(obj.array1).to.be.a(Array)
        expect(obj.array2).to.be.a(Array)
        expect(obj.array[1]).to.eql(2)
        expect(obj.array1[1]).to.eql(2)
        expect(obj.array2[1]).to.eql(2)
        expect(obj.reqNumber).to.be.a('number')
        expect(obj.isBoy).to.be.true
        expect(obj.isGirl).to.be.false
    })

    it('should filter object', function() {
        var src = {
          nick: 'asd',
          password: 'pass',
          birth: new Date('2014-05-06'),
          reqDate: new Date('1998-01-01'),
          reqString: 'abcde',
          reqNumber: 50,
          array: [],
          nonExist: 'not exists'
        }
        var obj = userModel.filter(src)
        console.log(obj)
        expect(obj.nick).to.be.ok()
        expect(obj.birth).to.be.ok()
        expect(obj.height).to.be(undefined)
        expect(obj.reqDate).to.be.ok()
        expect(obj.reqString).to.be.ok()
        expect(obj.obj1).to.be(undefined)
        expect(obj.array).to.be.a(Array)
        expect(obj.nonExist).to.be(undefined)
        expect(obj.password).to.be(undefined)
    })
})
