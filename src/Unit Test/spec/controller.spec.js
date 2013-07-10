describe('button directive', function () {
     var $compile, $rootScope;
     //beforeEach(module('directives.button'));
     beforeEach(module('myApp'));

     beforeEach(inject(function(_$compile_, _$rootScope_) {
       $compile = _$compile_;
       $rootScope = _$rootScope_;
     }));
    // beforeEach(inject(function ($injector, $rootScope) {
    //     $compile = $injector.get('$compile');
    //     scope = $rootScope.$new();
    // }));

     it('adds a "btn" class to the button element', function() {
         var element = $compile('<my-button></my-button>')($rootScope);
         //console.log(element);
         expect(element.hasClass('btn')).toBe(true);
      });

     it('adds size classes correctly', function() {
       var element = $compile('<my-button2 size="large"></my-button2>')
       ($rootScope);
       expect(element.hasClass('btn-large')).toBe(true);
     });

     it('set button type and CSS classes correctly', function() {
       var element = $compile('<my-button2 type="submit"></my-button2>')($rootScope);
       expect(element.hasClass('btn-primary')).toBe(true);
       expect(element.attr('type')).toBe('submit');
       
       element = $compile('<my-button2 type="reset"></my-button2>')($rootScope);
       expect(element.attr('type')).toBe('reset');
       
       element = $compile('<my-button2 type="warning"> </my-button2>')($rootScope);
       expect(element.hasClass('btn-warning')).toBe(true);
       expect(element.attr('type')).toBe('button');
     });

});


describe('myButton Directives', function () {
     var $compile, scope;
     
     function compileAndApply(template) {
        var compiled = $compile(template)(scope);
        scope.$apply();
        return compiled;
     }

     beforeEach(module('myApp'));

     beforeEach(inject(function ($injector, $rootScope) {
      $compile = $injector.get('$compile');
      scope = $rootScope.$new();
    }));

     it('adds a "btn" class to the button element', function () {
      var template = '<my-button></my-button>';
      compiled = compileAndApply(template);
      console.log(compiled);
      expect(compiled.hasClass('btn')).toBe(true);
    });

     it('adds size classes correctly', function() {
       var template = '<my-button2 size="large"></my-button2>';
       compiled = compileAndApply(template);
       expect(compiled.hasClass('btn-large')).toBe(true);
     });

    

});



describe('Blog Directives', function () {
    var $compile, scope;
    // this is a convenient function to use when unit testing directives;
    // you will find yourself doing this often
    function compileAndApply(template) {
        var compiled = $compile(template)(scope);
        scope.$apply();
        return compiled;
    }

    beforeEach(module('myApp'));
    beforeEach(inject(function ($injector, $rootScope) {
        $compile = $injector.get('$compile');
        scope = $rootScope.$new();
    }));

    describe('the linking function', function () {
        it('should not throw error if no ngModel supplied', function () {
            var template = '<form name="timeForm">' +
                '<input name="time" type="text" future-time/>' +
                '</form>';
            expect(function () {
                compileAndApply(template);
            }).not.toThrow();
        });
        it('should be valid on undefined value', function () {
            var template = '<form name="timeForm">' +
                '<input ng-model="time" name="time" type="text" future-time/>' +
                '</form>';
            compileAndApply(template);
            expect(scope.time).toBeUndefined();
            expect(scope.timeForm.$valid).toBeTruthy();
        });
        it('should be invalid on non-parseable date', function () {
            var template = '<form name="timeForm">' +
                    '<input ng-model="time" name="time" type="text" future-time/>' +
                    '</form>',
                compiled = compileAndApply(template);
            // this appears to be how you fake an input change.
            compiled.find('input').val('not a date');
            compiled.find('input').triggerHandler('input');
            expect(scope.timeForm.$valid).toBeFalsy();
        });
        it('should be invalid on past date', function () {
            var template = '<form name="timeForm">' +
                    '<input ng-model="time" name="time" type="text" future-time/>' +
                    '</form>',
                compiled = compileAndApply(template);
            compiled.find('input').val('1998-01-01');
            compiled.find('input').triggerHandler('input');
            expect(scope.timeForm.$valid).toBeFalsy();
        });
        it('should be valid on future date', function () {
            var template = '<form name="timeForm">' +
                    '<input ng-model="time" name="time" type="text" future-time/>' +
                    '</form>',
                compiled = compileAndApply(template);
            compiled.find('input').val('2050-01-01');
            compiled.find('input').triggerHandler('input');
            expect(scope.timeForm.$valid).toBeTruthy();
        });
    });
});

