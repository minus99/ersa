function Main() { 
    this.init();
}

Main.prototype = {
    constructor: Main,
    initPlugins: function (scope) {
        var _t = this;

        var target = scope.querySelectorAll('[data-swiper]');
        if (utils.detectEl(target) && typeof MinusSwiper !== 'undefined')
            utils.forEach(target, function (index, value) {
                new MinusSwiper({ ID: value });
            });

        target = scope.querySelectorAll('select, input');
        if (utils.detectEl(target) && typeof iStyler !== 'undefined')
            utils.forEach(target, function (index, value) {
                new iStyler({ ID: value });
            });

        target = scope.querySelectorAll('.ems-tab');
        if (utils.detectEl(target) && typeof minusTab !== 'undefined')
            utils.forEach(target, function (index, value) {
                new minusTab({ ID: value });
            });

        target = scope.querySelectorAll('.menu-category-holder');
        if (utils.detectEl(target) && typeof minusMenu !== 'undefined')
            utils.forEach(target, function (index, value) {
                new minusMenu({ ID: value });
            });


        target = scope.querySelectorAll('.ems-animated');
        if (utils.detectEl(target) && typeof minusWayPoint !== 'undefined')
            new minusWayPoint({ ID: target });
    },
    init: function () {
        var _t = this;
        _t.initPlugins(document);
    }
};

new Main();


/*read me more*/
(function(){

    var readMeMoreBtn = document.querySelector('.read-me-more');

    if(utils.detectEl(readMeMoreBtn)){
        function readMeMore(){
            this.parentElement.classList.toggle('show');
        }
        readMeMoreBtn.addEventListener('click', readMeMore);
    }
  
}());
/*read me more*/


/*product detail materials accordion*/
function addTopBtn(){
    this.parentElement.parentElement.classList.toggle('selected');
}

var elSe = document.querySelectorAll('.ems-tab-materials-head > a');
elSe.forEach(function(e){
    e.addEventListener('click', addTopBtn);
});
/*product detail materials accordion*/