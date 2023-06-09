// Example of an object literal
/* const person = {
  name: {
    first: 'Bob',
    last: 'Smith',
  },
  age: 32,
  bio: function () {
    console.log(`${this.name[0]} ${this.name[1]} is ${this.age} years old.`);
  },
  introduceSelf: function () {
    console.log(`Hi! I'm ${this.name[0]}.`);
  },
};

// console.log(person.name.first);

// person.age = 45;
// console.log(person.age);

person['eyes'] = 'hazel';
person.farewell = function () {
  console.log('Bye everybody!');
};

// console.log(person.farewell());

const myDataName = "height";
const myDataValue = "1.75m";

person[myDataName] = myDataValue;
 */
// console.log(person.height)

/////////////////////////////////////////////////////////////
// Example using a function to create objects made by creating separate
/* 
function createPerson(name) { 
  const obj = {};
  obj.name = name; // takes a parameter (name) to set the value of the "name" property
  obj.introduceSelf = function () {
    console.log(`Hi! I'm ${this.name}.`); 
  };
  return obj;
}

const salva = createPerson("Salva");
salva.name;
salva.introduceSelf();
// "Hi! I'm Salva."

const frankie = createPerson("Frankie");
frankie.name;
frankie.introduceSelf();
// "Hi! I'm Frankie."
 */

///////////////////////////////////////////////////////////// Example of a constructor

// Constructors start with a capital letter by convention
// difference form above - uses new and this. in the constructor function
function Person(name) {
  this.name = name;
  this.introduceSelf = function () {
    console.log(`Hi! I'm ${this.name}.`);
  };
}

// To call Person() as a constructor, use new:
const salva = new Person("Salva");
salva.name;
salva.introduceSelf();
// "Hi! I'm Salva."

const frankie = new Person("Frankie");
frankie.name;
frankie.introduceSelf();
// "Hi! I'm Frankie."
