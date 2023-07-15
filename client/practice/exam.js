console.log('start');
const result = new Promise((resolve, reject) => {
    console.log(1);
    setTimeout(() => reject('Whoops!'), 1000); 
    reject('a');
    console.log(2);
    return 2;
})
    .then(res => res)
    .catch(error => console.log('Error Happens'));
console.log(result); 
console.log('end');


// console.log('start');
// async function foo() {
//     const result = await new Promise((reject, resolve) => {
//         console.log(1);
//         reject("hello");
//         console.log(2);
//     })
//     console.log(result);
// }
// foo();
// console.log('end');


// let inputData = 'ponchanon';
// let reverseData='';
// for(i=0;i<inputData.length;i++){
//     reverseData = inputData[i]+reverseData;
// }
// console.log(reverseData);

//console.log('ponchanon'.splice(1,3))