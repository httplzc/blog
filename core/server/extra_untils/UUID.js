function UUID() {
    this.id = this.createUUID();
}

UUID.prototype.valueOf = function () {
    return this.id;
};
UUID.prototype.toString = function () {
    return this.id;
};


UUID.prototype.createUUID = function () {
    //  
    // Loose interpretation of the specification DCE 1.1: Remote Procedure Call  
    // described at  
    // http://www.opengroup.org/onlinepubs/009629399/apdxa.htm#tagtcjh_37  
    // since JavaScript doesn't allow access to internal systems, the last 48  
    // bits  
    // of the node section is made up using a series of random numbers (6 octets  
    // long).  
    //    
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = UUID.getIntegerBits(t, 0, 31);
    var tm = UUID.getIntegerBits(t, 32, 47);
    var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2  
    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);

    // since detection of anything about the machine/browser is far to buggy,  
    // include some more random numbers here  
    // if NIC or an IP can be obtained reliably, that should be put in  
    // here instead.  
    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 7)
        + UUID.getIntegerBits(UUID.rand(8191), 8, 15)
        + UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last number is two octets long
    return tl + tm + thv + csar + csl + n;
};


UUID.getIntegerBits = function (val, start, end) {
    var base16 = UUID.returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '')
            quadString += '0';
        else
            quadString += quadArray[i];
    }
    return quadString;
};

// Replaced from the original function to leverage the built in methods in  
// JavaScript. Thanks to Robert Kieffer for pointing this one out  
UUID.returnBase = function (number, base) {
    return (number).toString(base).toUpperCase();
};

// pick a random number within a range of numbers  
// int b rand(int a); where 0 <= b <= a  
UUID.rand = function (max) {
    return Math.floor(Math.random() * (max + 1));
};


module.exports = function () {
    return new UUID().id;
};
