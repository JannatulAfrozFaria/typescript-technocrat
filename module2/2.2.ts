{
    // 
    type User1 = {
        name: string;
        age: number;
    }
    //type alias is needed for prmitive type
    type roll = number;

    //in case of Object, we can use interface
    interface User2{
        name:string;
        age:number;
    }
    const user1: User1 = {
        name: 'Faria',
        age: 100,
    }
    // 
}