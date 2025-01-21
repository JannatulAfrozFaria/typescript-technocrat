{
    // 
    //TERNARY OPERATOR-----OPTIONAL CHAINING-----NULLISH COALESCING
    const age: number = 18;
    if(age >= 18){
        console.log('adult');
    }else{
        console.log('not adult')
    }
    //using ternary operator---
    const isAdult = age >= 18 ? 'adult' : 'not adult';
    console.log({isAdult});
    //nullish coalescing operator
    //nulll/ undefined----> decision making
    const isAutheticated = null;
    const result1 = isAutheticated ?? 'Guest';
    const result2 = isAutheticated ? isAutheticated :'Guest';

    console.log({result1}, {result2});

    //COALESCING
    type User = {
        name: string;
        address:{
            city: string;
            road: string;
            presentAddress: string;
            permanentAddress?:string
        }
    }
    const user: User ={
        name: 'p',
        address:{
            city: 'ctg',
            road: 'Awesome road',
            presentAddress: 'ctg town'
    }
    }
    const permanentAddress = user?.address?.permanentAddress ?? 'No permanent Address';
    console.log({permanentAddress});
   // ts-node-dev --respawn --transpile-only .\module1\source\1.11.ts
}