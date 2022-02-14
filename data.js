//? Local Storage vs Cookies vs Session:
//! Local Storage:
//! Cookies:
//! Session:


//? Scoping & Hoisting & Closure:
//* Scoping: 
// Lexical scoping can look up but can't look down or sideways (siblings). Inner scopes has access to its parent's scope. But outer scopes don't have access to the inner scopes. Sibling scopes don't have access to one another. Scope chain always works upwards not sideways.

//! Scoping Types: 
// Global scope,function scoped,blocked scopes.

//! Global Scope - Variables: 
// Can be accessed from anywhere. When you don't assign the a type (var / let / const).

//! Function Scope - Variables: 
// Can be accessed from everywhere inside the parent function. var are function scoped.

//! Blocked Scope - Variables:
// Can be accessed only inside the block (function, if, loop). let and const are block scoped.

//* Hoisting:
// Hoisting is JS's default behavior of moving declarations (functions & variables) to the top of the scope.

//! Why Create Hoisting?
// Creator of JS created hoisting so we can use function declarations before we use the function. This is essential for some programming techniques & some people also think this is more readable.

//! Why They Implemented Hoisting With Var variables? 
// Because that was the only way hoisting could be implemented at the time ( there was only var, let & const were added later to JS). But in hence sight it was really bad, but he didn't know JS will become so big.

//* Variables:
//! var:
// Hoisted: true. Initial value: undefined. Scope: function scoped.

//! let & const:
// Hoisted: false. Initial value: uninitialized. Scope: blocked.

//* Functions:
//! function expressions and arrows: 
// Depends on var or let/const just like normal variables.

//! function declarations:
// Hoisted: true. Initial value: Actual function. Scope: function.

//* Closure:
// We dont declare closures manually, it happens automatically in certain situations. Any function always has access to the variable environment where the function was created. Functions can access their parents functions scoped variable. If that parent function has returned, the function keeps a reference to its outer scope, which preserves the scope chain through out. In other words: A closure makes sure that a function doesn't lose connection to variables that existed at the functions birth place.

//? This:
//* Rules of the this keyword:
// 1. Every function gets the this keyword/variable. 
// 2. It points to the "owner" of the function in which the this keyword is used.
// 3. this keyword does NOT point to the function itself, only to the owner of that function, to whoever called it.
// 4. this keyword is NOT static. It depends on how the function is called, and its value is only assigned when the function is actually called.

//* How to call functions:
//! 1. Methods in an object: 
// this keyword points to the object which the method is called. (Method needs to be a normal function not an arrow). Owner: is the object who called the method.

//! 2. normal functions: 
// Owner: window object, strict-mode: undefined.

//! 3. arrow function: 
// Do not get their own this keyword. Gets the this keyword lexically. Pointing up. Owner: is the parent scope.

//! 4. event listener:
// this keyword is attached to the DOM element that the handler is attached to. Owner: Element that called the event listener.

//* What is the this keyword is NOT:
// this keyword does NOT point to the function itself. this keyword does not point to its variable environments.