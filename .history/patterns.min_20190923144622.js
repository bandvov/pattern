function App() {
    let args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        key, modules = args[0] && "string" == typeof args[0] ? args : args[0];
    if (!(this instanceof App)) return new App(modules, callback);
    if (this.productName = "isolated namespace sample", this.version = "1.0.0.0", !modules || "*" == modules)
        for (key in modules = [], App.modules) App.modules.hasOwnProperty(key) && modules.push(key);
    for (let i = 0; i < modules.length; i++) App.modules[modules[i]](this);
    callback(this)
}
App.modules = {}, App.modules.dom = function (box) {
    box.getElem = function (e) {
        document.write("call from getElem " + e + "<br>")
    }, box.create = function (e) {
        document.write("call from create " + e + "<br>")
    }
}, App("dom", function (box) {
    box.getElem("diiv")
}), App(function (box) {
    let e = box.getElem("dwa");
    box.create("try"), document.write(box.productName, " <br>"), document.write(box.version, "<br>")
});
let base = {
    name: "John",
    say: function () {
        console.log(this.name)
    },
    innerArray: [1, 2, 3]
};

function extendDeep(parent, child) {
    let toString = Object.prototype.toString,
        asStr = "[object Array]";
    child = child || {};
    for (let i in parent) parent.hasOwnProperty(i) && ("object" == typeof parent[i] ? (child[i] = toString(parent[i] == asStr) ? [] : {}, extendDeep(parent[i], child[i])) : child[i] = parent[i]);
    return child
}
let newObj = {};

function mix() {
    let args, i, child = {};
    for (args = 0; args < arguments.length; args++)
        for (i in console.log(`arguments[args] : ${arguments[args]}`), arguments[args]) arguments[args].hasOwnProperty(i) && (child[i] = arguments[args][i], console.log(`child[i] : ${arguments[args][i]}`));
    return child
}
extendDeep(base, newObj), newObj.name = "araq", newObj.say(), newObj.innerArray.push(4), console.log(base.innerArray), console.log(newObj.innerArray);
let ingredient1 = {
        egg: 5
    },
    ingredient2 = {
        sugar: "spoon"
    },
    ingredient3 = {
        flour: "cup"
    },
    ingredient4 = {
        milk: "bottle",
        wine: 200
    };

function Control() {}
console.log(mix(ingredient1, ingredient2, ingredient3, ingredient4)), Control.prototype.render = function () {
    document.write(`Control : ${this.name}<br>${this.control}`)
}, Control.create = function (type) {
    let newControl;
    if ("function" != typeof Control[type]) throw {
        name: "error",
        message: `constructor ${type} not found`
    };
    return "function" != typeof Control[type].prototype.render && (Control[type].prototype = new Control), newControl = new Control[type]
}, Control.button = function () {
    this.name = "button", this.control = '<input type="button" value="test button"'
}, Control.text = function () {
    this.name = "text", this.control = '<input type="text">'
};
let btn = Control.create("button");
btn.render();
let txt = Control.create("text");
txt.render();
let validator = {
    types: {},
    config: {},
    messages: [],
    validate: function (data) {
        let i, type, msg, invalid, checker;
        for (i in data)
            if (data.hasOwnProperty(i)) {
                if (type = this.config[i], checker = this.types[type], !type) continue;
                if (!checker) throw {
                    name: "validator error",
                    message: `validator ${type} not found`
                };
                (invalid = checker.validate(data[i])) && (msg = `value not correct for ${i}  ${checker.message}`, this.messages.push(msg))
            } return this.showError()
    },
    showError: function () {
        return 0 !== this.messages.length
    }
};
validator.types.required = {
    validate: function (value) {
        return "" === value
    },
    message: "should be filled"
}, validator.types.number = {
    validate: function (value) {
        return !/\d+/.test(value)
    },
    message: "should be a number"
}, validator.config = {
    firstName: "required",
    lastName: "required",
    age: "number"
};
let data1 = {
    firstName: "adas",
    lastName: "sada",
    age: 22
};
validator.validate(data1) || console.log(validator.messages);
let http = {
        makeRequest: function (id, callback) {
            setTimeout(function () {
                callback(`data from server ${(new Date).getTime()}<br>`)
            }, 3e3)
        }
    },
    proxy = function () {
        let cache = {};
        return {
            makeRequest: function (id, callback) {
                cache[id] ? callback(cache[id]) : http.makeRequest(id, function (data) {
                    cache[id] = data, callback(data)
                })
            }
        }
    }();

function get(id) {
    return document.getElementById(id)
}

function callback(data) {
    get("loader").style.display = "none", get("output").innerHTML += data + "<br>"
}
get("requestBtn1").addEventListener("click", function () {
    get("loader").style.display = "block";
    let id = get("forRequest").value;
    http.makeRequest(id, callback)
}), get("requestBtn2").addEventListener("click", function () {
    get("loader").style.display = "block";
    let id = get("forRequest").value;
    proxy.makeRequest(id, callback)
}, !1);
let mediator = {
        players: {},
        setup: function () {
            this.players.player1 = new Player("player1"), this.players.player2 = new Player("player2"), this.players.player3 = new Player("player3")
        },
        updateMediator: function () {
            let score = {
                player1: this.players.player1.points,
                player2: this.players.player2.points,
                player3: this.players.player3.points
            };
            scoreboard.update(score)
        },
        keypress: function (e) {
            49 != (e = e || window.event).keyCode ? (50 == e.keyCode && mediator.players.player2.updatePlayer(), 51 == e.keyCode && mediator.players.player3.updatePlayer()) : mediator.players.player1.updatePlayer()
        }
    },
    scoreboard = {
        element: null,
        update: function (score) {
            let i, msg = "";
            for (i in score) score.hasOwnProperty(i) && (msg += `<p>${i} : ${score[i]}</p>`);
            this.element.innerHTML = msg
        }
    };

function Player(name) {
    this.name = name, this.points = 0
}
Player.prototype.updatePlayer = function () {
    this.points++, mediator.updateMediator()
}, mediator.setup(), scoreboard.element = document.querySelector("p"), window.onkeypress = mediator.keypress;
class Observer {
    constructor() {
        this.observers = []
    }
    subscribe(fn) {
        this.observers.push(fn)
    }
    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn)
    }
    broadcast(text) {
        this.observers.forEach(elem => elem(text))
    }
}
let blogObserver = new Observer;
blogObserver.subscribe(text => console.log("broadcast catched"));
let textField = document.querySelector(".textField"),
    countField = document.querySelector(".countField");

function getWordsCount(text) {
    return text ? text.trim().split(/\s+/).length : 0
}
textField.addEventListener("keyup", function () {
    blogObserver.broadcast(textField.value)
}), blogObserver.subscribe(text => {
    console.log(text), countField.innerHTML = getWordsCount(text)
});