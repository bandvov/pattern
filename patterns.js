"use script";

// ========================== namespace ====================
// let App;
// App = App || {};

// App.define = function (namespace) {
//     let parts = namespace.split('.');
//     parent = App;

//     if (parts[0] == 'App') {
//         parts = parts.slice(1);
//     }
//     for (let i = 0; i < parts.length; i++) {
//         if (typeof parent[parts[i]] == 'undefined') {

//             parent[parts[i]] = {};
//         }
//         parent = parent[parts[i]];

//     }
//     console.log(parent);
//     return parent;
// }
// module = App.define('App.utils.dom');
// module = App.define('App.utils.ajax');
// // ==or=
// module = App.define('utils.dom');

// console.log(module == App.utils.dom);
// console.log(App);

// ======================== pattern module ===============
// let App;

// App = App || {};

// App.define = function (namespace) {
//     let parts = namespace.split('.'),
//         parent = App,
//         i;
//     if (parts[0] == 'App') {
//         parts = parts.slice(1);
//     }
//     for (i = 0; i < parts.length; i++) {
//         if (typeof parent[parts[i]] == 'undefined') {
//             parent[parts[i]] = {};
//         }
//         parent = parent[parts[i]];
//     }
//     return parent;
// }

// App.define('util.calc');
// App.define('util.dom');
// console.log(App);

// App.util.calc = (function () {
//     let x, y;

//     function _setX(val) {
//         x = val;
//     }

//     function _setY(val) {
//         y = val;
//     }

//     function _add() {
//         return x + y;
//     }
//     return {
//         setX: _setX,
//         setY: _setY,
//         add: _add
//     }
// }())

//     var calc = App.util.calc;
//     console.log(calc);

//     calc.setX(3);
//     calc.setY(3);

//     document.write(calc.add());

// =========================== isolated namespace =============

function App() {
  let args = Array.prototype.slice.call(arguments),
    callback = args.pop(),
    key;

  let modules = args[0] && typeof args[0] == "string" ? args : args[0];

  if (!(this instanceof App)) {
    return new App(modules, callback);
  }
  this.productName = "isolated namespace sample";
  this.version = "1.0.0.0";

  if (!modules || modules == "*") {
    modules = [];
    for (key in App.modules) {
      if (App.modules.hasOwnProperty(key)) {
        modules.push(key);
      }
    }
  }
  for (let i = 0; i < modules.length; i++) {
    App.modules[modules[i]](this);
  }
  callback(this);
}
App.modules = {};

App.modules.dom = function(box) {
  box.getElem = function(e) {
    document.write("call from getElem " + e + "<br>");
  };
  box.create = function(e) {
    document.write("call from create " + e + "<br>");
  };
};

App("dom", function(box) {
  box.getElem("diiv");
});
App(function(box) {
  let e = box.getElem("dwa");
  box.create("try");
  document.write(box.productName, " <br>");
  document.write(box.version, "<br>");
});

// ======================================inheritance through Proto ==============
// let base = {
//     name:'John'
// }

// function createObj(obj) {
//     function F(){}
//     F.prototype = obj;
//     return new F();
// }

// let derived = createObj(base);
// console.log(derived.name);

// ===============================inheritance ECMA5==============
// let base = {
//     name: 'John'
// }
// let derived = Object.create(base);

// або з додаванням нового свойства (метода)
// *****************
//  derived = Object.create(base,{surname:{value:'aga'}});

// console.log(derived.name);
// console.log(derived.surname);

// ==============================extend inheritance======================
// innerArray в parent і child спільний

// let base = {
//     name: 'John',
//   say: function() {
//         console.log(this.name);
//     },
//         innerArray:[1,2,3]
// }
// function extend(parent,child) {
//     child = child || {};
//     for (prop in parent) {
//         if (parent.hasOwnProperty(prop)) {
//             child[prop] = parent[prop];
//         }
//     }
//     return child;
// }
// let newObj = {};
// extend(base,newObj);
// newObj.name = 'araq'
// newObj.say();
// newObj.innerArray.push(4);
// console.log(base.innerArray);
// console.log(newObj.innerArray);

// ============================== extend deep =============================

let base = {
  name: "John",
  say: function() {
    console.log(this.name);
  },
  innerArray: [1, 2, 3]
};

function extendDeep(parent, child) {
  let toString = Object.prototype.toString;
  let asStr = "[object Array]";

  child = child || {};

  for (let i in parent) {
    if (parent.hasOwnProperty(i)) {
      if (typeof parent[i] == "object") {
        child[i] = toString(parent[i] == asStr) ? [] : {};
        extendDeep(parent[i], child[i]);
      } else {
        child[i] = parent[i];
      }
    }
  }
  return child;
}

let newObj = {};
extendDeep(base, newObj);
newObj.name = "araq";
newObj.say();
newObj.innerArray.push(4);
console.log(base.innerArray);
console.log(newObj.innerArray);

// ============================== mixed inheritance ================

function mix() {
  let args,
    i,
    child = {};
  for (args = 0; args < arguments.length; args++) {
    console.log(`arguments[args] : ${arguments[args]}`);

    for (i in arguments[args]) {
      if (arguments[args].hasOwnProperty(i)) {
        child[i] = arguments[args][i];
        console.log(`child[i] : ${arguments[args][i]}`);
      }
    }
  }
  return child;
}
let ingredient1 = {
  egg: 5
};
let ingredient2 = {
  sugar: "spoon"
};
let ingredient3 = {
  flour: "cup"
};
let ingredient4 = {
  milk: "bottle",
  wine: 200
};

console.log(mix(ingredient1, ingredient2, ingredient3, ingredient4));
// ======================================== pattern factory =====================
function Control() {}
Control.prototype.render = function() {
  document.write(`Control : ${this.name}<br>${this.control}`);
};
Control.create = function(type) {
  let newControl;
  if (typeof Control[type] !== "function") {
    throw {
      name: "error",
      message: `constructor ${type} not found`
    };
  }
  if (typeof Control[type].prototype.render !== "function") {
    Control[type].prototype = new Control();
  }
  newControl = new Control[type]();
  return newControl;
};
Control.button = function() {
  this.name = "button";
  this.control = `<input type="button" value="test button">`;
};
Control.text = function() {
  this.name = "text";
  this.control = `<input type="text">`;
};
let btn = Control.create("button");
btn.render();
let txt = Control.create("text");
txt.render();

// ================================ pattern factory #2 =================

class Car {
  constructor(options) {
    this.doors = options.doors || 4;
    this.state = options.state || "brand new";
    this.color = options.color || "silver";
  }
}

class Truck {
  constructor(options) {
    this.state = options.state || "used";
    this.wheelSize = options.wheelSize || "Big";
    this.color = options.color || "green";
  }
}

class VehicleFactory extends Car {
  constructor(options) {
    super(options);
  }

  createVechicle(options) {
    switch (options.vechicleType) {
      case "car":
        this.vechicleClass = Car;
        break;
      case "truck":
        this.vechicleClass = Truck;
        break;
    }
    return new this.vechicleClass(options);
  }
}

let carFactory = new VehicleFactory({});

let car = carFactory.createVechicle({
  vechicleType: "car"
});
console.log(car);

console.log(carFactory instanceof Car);

// ================================= patter simple factory ===============
class WoodenDoor {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
}
class WoodDoorFactory {
  makeDoor(width, height) {
    return new WoodenDoor(width, height);
  }
}
const door = new WoodDoorFactory().makeDoor(100, 220);
console.log(door.getWidth());
console.log(door.getHeight());

// ================================== pattern factory method ==========
// allows  to delegate the logic of creating the necessary instances to the child classes.
class Developer {
  askQuestions() {
    console.log("asking about developing");
  }
}
class CommunityExecutive {
  askQuestions() {
    console.log("asking about community building");
  }
}
class HiringManager {
  takeInterview() {
    const interviewer = this.makeInterviewer();
    interviewer.askQuestions();
  }
}
class DevelopmentManager extends HiringManager {
  makeInterviewer() {
    return new Developer();
  }
}
class CommunityManager extends HiringManager {
  makeInterviewer() {
    return new CommunityExecutive();
  }
}
const devMan = new DevelopmentManager();
devMan.takeInterview();
const commMan = new CommunityManager();
commMan.takeInterview();

// ================================== pattern abstract factory ===============
// group other factories with logical connections
class PlasticDoor {
  getDescription() {
    console.log("I am plastic door");
  }
}
class PlasticDoorInstaller {
  getDescription() {
    console.log("I can fit plastic door");
  }
}
class PlasticDoorFactory {
  makeDoor() {
    return new PlasticDoor();
  }
  makeDoorInstaller() {
    return new PlasticDoorInstaller();
  }
}
const door1 = new PlasticDoorFactory().makeDoor();
const doorInstaller = new PlasticDoorFactory().makeDoorInstaller();
door1.getDescription();
doorInstaller.getDescription();
// =====================================factory 4 =========================
class ReptileTail {
  constructor(props) {
    this.tail = props.tail;
  }
}
class ReptileLegs {
  constructor(props) {
    this.legs = props.legs;
  }
  getLegsNumber() {
    return this.legs;
  }
}
class ReptileTorso {
  constructor(props) {
    this.torso = props.torso;
  }
  getTorso() {
    return this.torso;
  }
}
let reptileBodyParts = {};
reptileBodyParts["tail"] = ReptileTail;
reptileBodyParts["legs"] = ReptileLegs;
reptileBodyParts["torso"] = ReptileTorso;

class ReptileBodyFactory {
  constructor(type, props) {
    return new reptileBodyParts[type](props);
  }
}
const reptileProps = {
  legs: 4,
  tail: "very long",
  torso: "green"
};
const reptileLegs = new ReptileBodyFactory("legs", reptileProps);
console.log(reptileLegs.getLegsNumber());
const reptileTorso = new ReptileBodyFactory("torso", reptileProps);
console.log(reptileTorso.getTorso());

// ================================== pattern adapter ======================
// patter adapter makes compatible uncompatible object without changing the source code
class AfrikanLion {
  roar() {
    console.log("a r r r r");
  }
}
class AsianLion {
  roar() {
    console.log("a r r r r");
  }
}
class Hunter {
  hunt(lion) {
    lion.roar();
  }
}

class WildDog {
  bark() {
    console.log("waw-waw-waw");
  }
}
class WildDogAdapter {
  constructor(dog) {
    this.dog = dog;
  }
  roar() {
    this.dog.bark();
  }
}
const wildDog = new WildDog();
const wildDogAdapter = new WildDogAdapter(wildDog);

const hunter = new Hunter();
hunter.hunt(wildDogAdapter);
const lion = new AfrikanLion();
hunter.hunt(lion);

// ================================== pattern composite ====================

class Developer1 {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }
  getName() {
    return this.name;
  }
  getSalary() {
    return this.salary;
  }
  setSalary(salary) {
    this.salary = salary;
  }
}

class Designer1 {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }
  getName() {
    return this.name;
  }
  getSalary() {
    return this.salary;
  }
}

class Organization {
  constructor() {
    this.employees = [];
  }
  addEmployee(employee) {
    this.employees.push(employee);
  }
  getNetSalary() {
    let netSalary = 0;
    this.employees.map(employee => {
      console.log("employee", employee.salary);
      netSalary += employee.salary;
    });
    return netSalary;
  }
}

const adam = new Developer1("John", 11111);
const mada = new Designer1("Jane", 3333);
const organization = new Organization();

organization.addEmployee(adam);
organization.addEmployee(mada);

console.log(organization.getNetSalary());

// ================================== pattern iterator ====================

// ================================== pattern strategy =====================
class NovaPoshta {
  calculate(pacCkage) {
    switch (pacCkage.size) {
      case "small":
        return 6;
      case "big":
        return 20;
      default:
        11;
    }
  }
}
class UkrPoshta {
  calculate(pacCkage) {
    switch (pacCkage.size) {
      case "small":
        return 10;
      case "big":
        return 15;
      default:
        "no data";
    }
  }
}

class Shipping {
  constructor(company) {
    this.company = company||'';
  }
  setStrategy(company) {
    this.company = company;
  }
  calculateShipping = pacCkage => {
   return this.company.calculate(pacCkage);
  };
}
let novaP = new NovaPoshta();
let ukrP = new UkrPoshta();

let pacCkage = {
  from: "Lviv",
  to: "Kyiv",
  size: "big"
};
let shipping = new Shipping();

shipping.setStrategy(novaP);
console.log(shipping.calculateShipping(pacCkage));
shipping.setStrategy(ukrP)
console.log(shipping.calculateShipping(pacCkage));

// ================================== pattern strategy 2 ========================

let validator = {
  types: {},
  config: {},
  messages: [],
  validate: function(data) {
    let i, type, msg, invalid, checker;
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i];
        checker = this.types[type];
        if (!type) {
          continue;
        }
        if (!checker) {
          throw {
            name: "validator error",
            message: `validator ${type} not found`
          };
        }
        invalid = checker.validate(data[i]);
        if (invalid) {
          msg = `value not correct for ${i}  ${checker.message}`;
          this.messages.push(msg);
        }
      }
    }
    return this.showError();
  },
  showError: function() {
    return this.messages.length !== 0;
  }
};

validator.types.required = {
  validate: function(value) {
    return value === "";
  },
  message: "should be filled"
};
validator.types.number = {
  validate: function(value) {
    return !/\d+/.test(value);
  },
  message: "should be a number"
};

validator.config = {
  firstName: "required",
  lastName: "required",
  age: "number"
};

let data1 = {
  firstName: "adas",
  lastName: "sada",
  age: 22
};
if (!validator.validate(data1)) {
  console.log(validator.messages);
}
// ===================================== pattern proxy ===========================
let http = {
  makeRequest: function(id, callback) {
    setTimeout(function() {
      callback(`data from server ${new Date().getTime()}<br>`);
    }, 3000);
  }
};
let proxy = (function() {
  let cache = {};
  return {
    makeRequest: function(id, callback) {
      if (cache[id]) {
        callback(cache[id]);
      } else {
        http.makeRequest(id, function(data) {
          cache[id] = data;
          callback(data);
        });
      }
    }
  };
})();

function get(id) {
  return document.getElementById(id);
}

function callback(data) {
  get("loader").style.display = "none";
  get("output").innerHTML += data + "<br>";
}

get("requestBtn1").addEventListener("click", function() {
  get("loader").style.display = "block";
  let id = get("forRequest").value;
  http.makeRequest(id, callback);
});
get("requestBtn2").addEventListener(
  "click",
  function() {
    get("loader").style.display = "block";
    let id = get("forRequest").value;
    proxy.makeRequest(id, callback);
  },
  false
);
// ===================================== pattern mediator =====================
// let mediator = {
//   players: {},
//   setup: function() {
//     this.players.player1 = new Player("player1");
//     this.players.player2 = new Player("player2");
//     this.players.player3 = new Player("player3");
//   },
//   updateMediator: function() {
//     let score = {
//       player1: this.players.player1.points,
//       player2: this.players.player2.points,
//       player3: this.players.player3.points
//     };
//     scoreboard.update(score);
//   },
//   keypress: function(e) {
//     e = e || window.event;
//     if (e.keyCode == 49) {
//       mediator.players.player1.updatePlayer();
//       return;
//     }
//     if (e.keyCode == 50) {
//       mediator.players.player2.updatePlayer();
//     }
//     if (e.keyCode == 51) {
//       mediator.players.player3.updatePlayer();
//     }
//   }
// };

// let scoreboard = {
//   element: null,
//   update: function(score) {
//     let i,
//       msg = "";
//     for (i in score) {
//       if (score.hasOwnProperty(i)) {
//         msg += `<p>${i} : ${score[i]}</p>`;
//       }
//     }
//     this.element.innerHTML = msg;
//   }
// };

// class Player {
//   constructor(name) {
//     this.name = name;
//     this.points = 0;
//   }
//   updatePlayer() {
//     this.points++;
//     mediator.updateMediator();
//   }
// }
// mediator.setup();
// scoreboard.element = document.querySelector("p");

// window.onkeypress = mediator.keypress;
// ======================================== same mediaator in ES6 ====
// class Mediator {
//   constructor() {
//     this.players = {};
//   }
//   setup() {
//     this.players.player1 = new Player("first");
//     this.players.player2 = new Player("second");
//     this.players.player3 = new Player("third");
//   }
//   updateMediator() {
//     let score = {
//       player1: this.players.player1.points,
//       player2: this.players.player2.points,
//       player3: this.players.player3.points
//     };
//     this.scoreBoard.update(score);
//   }
//   keypress(e) {
//     e = e || window.event;
//     if (e.keyCode == 49) {
//       this.players.player1.updatePlayer();
//     }
//     if (e.keyCode == 50) {
//       this.players.player2.updatePlayer();
//     }
//     if (e.keyCode == 51) {
//       this.players.player3.updatePlayer();
//     }
//   }

//   scoreBoard = {
//     element: null,
//     update: function(score) {
//       console.log(this);

//       let msg = "";
//       for (let i in score) {
//         if (score.hasOwnProperty(i)) {
//           msg += `<p>${i} : ${score[i]} </p>`;
//         }
//       }
//       this.element.innerHTML = msg;
//     }
//   };
// }

// class Player {
//   constructor(name) {
//     this.name = name;
//     this.points = 0;
//   }
//   updatePlayer() {
//     this.points++;
//     mediator.updateMediator();
//   }
// }
// let mediator = new Mediator();
// let mediator1 = new Mediator();
// mediator1.newFunction = () => {
//   console.log("some new method");
// };
// console.log(mediator);
// console.log(mediator1);

// mediator.setup();
// console.log(mediator);
// mediator.scoreBoard.element = document.querySelector("p");
// console.log(mediator.scoreBoard.element);

// window.onkeypress = mediator.keypress.bind(mediator);

// ======================================== mediator N2  ==================
class ChatRoom {
  showMessage(fromUser, toUser, message) {
    let date = new Date().toLocaleDateString();
    let sender = fromUser.getName();
    let receiver = toUser.getName();
    console.log(`${date}\n user ${sender} sent to ${receiver} : ${message}`);
  }
}
class ChatUser {
  constructor(name, mediator) {
    this.name = name;
    this.mediator = mediator;
  }
  getName() {
    return this.name;
  }
  send(message, toUser) {
    this.mediator.showMessage(this, toUser, message);
  }
}
const chatRoom = new ChatRoom();
const jane = new ChatUser("jane", chatRoom);
const alex = new ChatUser("alex", chatRoom);
const sam = new ChatUser("sam", chatRoom);
jane.send("hello there", alex);
alex.send("hey i am developer", jane);
sam.send("i am from usa", jane);
// ================================== mediator 3 ==============
// class ChatUser {
//   constructor(name) {
//     this.name = name;
//     this.chatRoom = null;
//   }
//   userSend(message, toUser) {
//     this.chatRoom.chatRoomSend(message,this,toUser);

//   }
//   receive(message,fromUser){
// console.log(`${fromUser.name} send to ${fromUser.name} message ${message}`);

//   }
// }
// class ChatRoom {
//   constructor() {
//     this.members = [];
//   }
//   addChatUser(user){
// this.members.push(user)
// user.chatRoom = this
//   }
//   chatRoomSend(message,fromUser,toUser) {
//     toUser.receive(message,fromUser)
//   }
//   getUsers(){
//     return this.members
//   }
// }
// let bob = new ChatUser('bob')
// let sam = new ChatUser('sam')
// let chatRoom = new ChatRoom()
// chatRoom.addChatUser(bob)
// chatRoom.addChatUser(sam)
// console.log(chatRoom.getUsers());
// bob.userSend('hello sam',sam)

// ===================================== pattern observer =====================

// class Observer {
//   constructor() {
//     this.observers = [];
//   }
//   subscribe(fn) {
//     this.observers.push(fn);
//   }
//   unsubscribe(fn) {
//     this.observers = this.observers.filter(subscriber => subscriber !== fn);
//   }
//   broadcast(text) {
//     this.observers.forEach(elem => elem(text));
//   }
// }

// let blogObserver = new Observer();

// blogObserver.subscribe(text => console.log("broadcast catched"));

// let textField = document.querySelector(".textField");
// let countField = document.querySelector(".countField");

// function getWordsCount(text) {
//   return text ? text.trim().split(/\s+/).length : 0;
// }
// textField.addEventListener("keyup", function() {
//   blogObserver.broadcast(textField.value);
// });

// blogObserver.subscribe(text => {
//   console.log(text);

//   countField.innerHTML = getWordsCount(text);
// });

//  ===================== pattern observer #2 =============

// class Emitter {
//     constructor() {
//         this.events = {};
//         console.log(this.events);

//     }
// }
// Emitter.prototype.on = function (type, listener) {
//     this.events[type] = this.events[type] || [];
//     this.events[type].push(listener);
// }

// Emitter.prototype.emit = function (type) {
//     if (this.events[type]) {
//         this.events[type].forEach((listener) => listener());
//     }
// }
// Emitter.prototype.remove = function (type) {
//     delete this.events[type];
// }

// let emtr = new Emitter();
// console.log(emtr);

// emtr.on('foo', function () {
//     console.log('message from foo');
// })
// emtr.on('bar', function () {
//     console.log('message from bar');

// })

// emtr.emit('foo');
// emtr.emit('bar');

// emtr.remove('bar');
// console.log(emtr);

// ==================== observer №3 ===============
class ObserverList {
  constructor() {
    this.observerList = [];

    this.add = obj => {
      return this.observerList.push(obj);
    };
  }
}

class Subject {
  constructor() {
    this._observers = new ObserverList();

    this.addObserver = observer => {
      this._observers.add(observer);
    };
    this.notify = context => {
      this._observers.observerList.map(item => item.update(context));
    };
  }
}

class Observer {
  constructor() {
    this.update = () => {
      //...
    };
  }
}

function extend(obj, extension) {
  for (var key in extension) {
    obj[key] = extension[key];
  }
}

let checkboxcontrol = document.querySelector("#mainCheckbox");
let addBtn = document.querySelector("#addNewObserver");
let container = document.querySelector("#observersContainer");
let removeBtn = document.querySelector("#removeObs");
extend(checkboxcontrol, new Subject());

checkboxcontrol.onclick = function() {
  checkboxcontrol.notify(this.checked);
};

addBtn.onclick = addNewObserver;

function addNewObserver() {
  let check = document.createElement("input");
  check.type = "checkbox";

  extend(check, new Observer());

  check.update = function(value) {
    this.checked = value;
  };
  checkboxcontrol.addObserver(check);
  container.appendChild(check);
}
console.log(checkboxcontrol._observers);

// ============================== pattern observer 4 ========================
const jobpost = title => {
  return { title };
};
class JobSeeker {
  constructor(name) {
    this.name = name;
  }
  notify(jobpost) {
    console.log(`${this.name} have been notified about ${jobpost.title}`);
  }
}
class JopBoard {
  constructor() {
    this._subscribers = [];
  }

  subscribe(jobseeker) {
    this._subscribers.push(jobseeker);
  }
  addJob(message) {
    this._subscribers.forEach(subscriber => {
      subscriber.notify(jobpost(message));
    });
  }
}
const johns = new JobSeeker("John");
const amss = new JobSeeker("Amss");
const rohns = new JobSeeker("Rohn");

const jopBoard = new JopBoard();
console.log(jopBoard);

jopBoard.subscribe(johns);
jopBoard.subscribe(amss);
jopBoard.subscribe(rohns);

jopBoard.addJob("posting new job");

// ==================== DOM pattern ==============
class Clock {
  constructor(template) {
    this.template = template;
  }

  render() {
    let date = new Date();

    let hours = date.getHours();
    if (hours < 10) hours = "0" + hours;

    let mins = date.getMinutes();
    if (mins < 10) mins = "0" + mins;

    let secs = date.getSeconds();
    if (secs < 10) secs = "0" + secs;

    let output = this.template
      .replace("h", hours)
      .replace("m", mins)
      .replace("s", secs);

    console.log(output);
  }

  stop() {
    clearInterval(this.timer);
  }

  start() {
    this.render();
    this.timer = setInterval(() => this.render(), 1000);
  }
}
let clock = new Clock("hms");

// clock.start();

function findLetter(word) {
  let wordObj = {};
  word.split("").forEach(letter => {
    if (wordObj.hasOwnProperty(letter)) {
      wordObj[letter]++;
    } else {
      wordObj[letter] = 1;
    }
  });
  console.log(wordObj);
  word = word
    .toLowerCase()
    .split("")
    .map(letter => {
      if (wordObj[letter] > 1) {
        return ")";
      } else {
        return "(";
      }
    });
  return word.join("");
}
console.log(findLetter("sobaka"));
// ============================================ pattern chain responsebilities ===========
class Account {
  setNext(successor) {
    this.successor = successor;
  }
  pay(ammount) {
    if (this.canPay(ammount)) {
      console.log(`paying ${ammount} using ${this.name}`);
    } else if (this.successor) {
      console.log(`cannot pay using ${this.name}.Proceeding...`);
      this.successor.pay(ammount);
    }
  }
  canPay(ammount) {
    return this.ballance >= ammount;
  }
}
class Bank extends Account {
  constructor(ballance) {
    super();
    this.name = "Bank";
    this.ballance = ballance;
  }
}
class PayPal extends Account {
  constructor(ballance) {
    super();
    this.name = "Paypal";
    this.ballance = ballance;
  }
}
const bank = new Bank(222);
const paypal = new PayPal(555);
bank.setNext(paypal);
bank.pay(333);
console.log(bank);

// =====================================================

class Person {
  constructor(first, last, age, gender, interests) {
    this.name = {
      first,
      last
    };
    this.age = age;
    this.gender = gender;
    this.interests = interests;
  }
  greeting() {
    console.log("Hi! I'm " + this.name.first + ".");
  }
  static compare(a, b) {
    return a.name - b.name;
  }
}
class Teacher extends Person {
  constructor(first, last, age, gender, interests, subject) {
    super(first, last, age, gender, interests);
    this.subject = subject;
  }
  greeting() {
    let x =
      this.gender === "Male" || this.gender === "male" || this.gender === "m"
        ? "Mr"
        : "Ms";
    console.log(
      `Hello I am  ${x} ${this.name.last} I am a teacher of ${this.subject} `
    );
  }
}

let tea = new Teacher(
  "john",
  "Smith",
  55,
  "m",
  ["playing,swimming"],
  "chemistry"
);

console.log(tea);
tea.greeting();
// ================================== pattern builder =================
class Burger {
  constructor(builder) {
    this.size = builder.size;
    this.pepperoni = builder.pepperoni || false;
    this.cheeze = builder.cheeze || false;
    this.tomato = builder.tomato || false;
  }
}

class BurgerBuilder {
  constructor(size) {
    this.size = size;
  }
  addPepperony() {
    this.pepperoni = true;
    return this;
  }
  addTomato() {
    this.tomato = true;
    console.log(this);

    return this;
  }
  addCheeze() {
    this.cheeze = true;
    return this;
  }
  build() {
    return new Burger(this);
  }
}
let burger = new BurgerBuilder(14)
  .addCheeze()
  .addPepperony()
  .addTomato()
  .build();
console.log(burger);

