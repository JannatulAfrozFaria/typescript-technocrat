//REFERENCE type-----Object
const user :{
    readonly company:'PH'; //type---->literal types
    firstName:string;
    middleName?: string; //optional type
    lastName:string;
    isMarried:boolean;
} = {
    company:'PH',
    firstName: 'Mezbaul',
    middleName: 'Abedin',
    lastName: 'Persian',
    isMarried: true
};

user.company='p'