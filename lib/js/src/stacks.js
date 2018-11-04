
(function () {
    var application = Stimulus.Application.start();

    window.Stacks = window.Stacks || Object.create(null);
    Stacks.controllers = Object.create(null);

    function createController(name, data) {
        var Controller = function () {
            Stimulus.Controller.apply(this, arguments);
        };
        Controller.prototype = Object.create(Stimulus.Controller.prototype, {
            constructor: { value: Controller, enumerable: false }
        });
        Object.setPrototypeOf(Controller, Stimulus.Controller);

        var targets;
        for (var prop in data) if (data.hasOwnProperty(prop)) {
            if (prop === "targets") {
                targets = data[prop];
                Object.defineProperty(Controller, "targets", {
                    get: function () { return targets; },
                    enumerable: false
                });
            } else {
                Controller.prototype[prop] = data[prop];
            }
        }
        Object.defineProperty(Controller, "stacksControllerName", { get: function () { return name; }});
        return Controller;
    }

    function registerController(Controller) {
        var name = Controller.stacksControllerName;
        if (!name) {
            throw "Controller wasn't created via Stacks.createController";
        }
        application.register(name, Controller);
        Stacks.controllers[name] = Controller;
    }

    Stacks.addController = function addController(name, data) {
        if (!/^s-/.test(name)) {
            throw "Stacks-created Stimulus controller names must start with \"s-\".";
        }
        registerController(createController(name, data));
    };
})()