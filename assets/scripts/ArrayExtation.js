(function () {
    Array.prototype.contains = function (elem) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] == elem) {
                return true;
            }
        }
        return false;
    };
    
    Array.prototype.delete = function (o) {
        let index = this.indexOf(o);
        if(index != -1){
            this.splice(index,1);
        }
        return this;
    };
})();