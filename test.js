var sayA = new Promise((resolve, reject) =>  {
	console.log("A");
	resolve();
});

var sayB = new Promise((resolve, reject) => {
	console.log("B");
	resolve();
});

var sayC = new Promise((resolve, reject) => {
	console.log("C");
	resolve();
});

Promise.all([sayA, sayB, sayC]);

var
