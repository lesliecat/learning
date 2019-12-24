 var obj = {
    a : function() {

    },
    b: 3,
    c: function() {
        this.b += 1
        console.log(this.b)
    }
}



module.exports = obj