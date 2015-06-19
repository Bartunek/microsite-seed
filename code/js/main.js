// Some JS leveraging ES6 syntax

class Main {
  constructor(name) {
    this.appName = name;
  }
  sayName() {
    return this.appName;
  }
}

$(() => {
  var main = new Main('Microsite Seed');
  console.log( main.sayName() );
});
