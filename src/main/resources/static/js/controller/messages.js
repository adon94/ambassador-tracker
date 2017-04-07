angular.module('myApp').controller('messages', function() {

    let self = this;

    self.taxPaid = 0;
    self.netIncome = 0;

    self.getTax = function () {
        if(self.salary > 33800) {
            let low = 27040;
            let high = (self.salary - 33800) * 0.6;
            self.netIncome = low + high + 3300;
            self.taxPaid = self.salary - self.netIncome;
            getExpenditure();
        } else {
            self.netIncome = (self.salary * 0.8) + 3300;
            self.taxPaid = self.salary - self.netIncome;
            getExpenditure();
        }
    };

    let getExpenditure = function () {
        let total = 53680;

        self.spPercent = (19627/total);
        self.sp = self.spPercent * self.taxPaid;

        self.hP = (13175/total);
        self.h = self.hP * self.taxPaid;

        self.eP = (8524/total);
        self.e = self.eP * self.taxPaid;

        self.jP = (2264/total);
        self.j = self.jP * self.taxPaid;

        self.afP = (1134/total);
        self.af = self.afP * self.taxPaid;

        self.yP = (1134/total);
        self.y = self.yP * self.taxPaid;

        self.rP = (940/total);
        self.r = self.rP * self.taxPaid;

        self.dP = (837/total);
        self.d = self.dP * self.taxPaid;

        self.ttP = (722/total);
        self.tt = self.ttP * self.taxPaid;

        self.faP = (694/total);
        self.fa = self.faP * self.taxPaid;

        self.fP = (430/total);
        self.f = self.fP * self.taxPaid;

        self.enP = (325/total);
        self.en = self.enP * self.taxPaid;

        self.aP = (234/total);
        self.a = self.aP * self.taxPaid;
    }

});
angular.module('myApp').filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);
