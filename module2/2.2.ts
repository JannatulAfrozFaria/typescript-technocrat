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
}