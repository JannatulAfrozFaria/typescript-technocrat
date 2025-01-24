{
    // 
    type User1 = {
        name: string;
        age: number;
    }
    //type alias is needed for prmitive type
    type roll = number;

    //in case of Object, we can use interface
    
    const user1: User1 = {
        name: 'Faria',
        age: 100,
    }
    // 

    //intersect
    //to extend type, we have to use & 
    type UserWithRoll1 = User1 & {role : string}

    const user2:UserWithRoll1 = {
        name: 'Parsa',
        age: 90,
        role: 'student' //if role not added, it will show error
    }

    //with interface
    interface User2{
        name:string;
        age:number;
    }
    //to extend interface, we have to use extend key word
    interface UserWithRoll2 extends User2 {
        role: string;
    }
    const user3:UserWithRoll2 = {
        name: 'Parsa',
        age: 90,
        role: 'student' //if role not added, it will show error
    }

    //in case of array----
    //type alias
    type Roll1 = number[];
    //interface----
    interface Roll2{
        [index:number] : number
    }
    const rollNumber1:Roll2 = [1,2,3]


    //in case of function---
    type Add = (num1:number,num2:number) => number;
    interface Add2 {
        (num1:number,num2:number) : number
    }

    const add: Add2 = (num1,num2) => num1 +num2
}