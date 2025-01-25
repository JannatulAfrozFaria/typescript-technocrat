{   
    
    //generic type
    const rollNumbers :  number[] = [3,6,8];
    const rollNumbers2 :  Array<number> = [3,6,8];

    const mentors: string[] = ['Mr' , 'Y' , 'Z'];
    const mentors2: Array<string> = ['Mr' , 'Y' , 'Z'];

    const booleanArray:boolean[] = [true, false, true];
    const booleanArray2: Array<boolean> = [true, false, true];

    //dynamic type declaration 
    type GenericArray<T> = Array<T>

    const rollNumbers3 :  GenericArray<number> = [3,6,8];
    const mentors3: GenericArray<string> = ['Mr' , 'Y' , 'Z'];
    const booleanArray3: GenericArray<boolean> = [true, false, true];

    
    const user : GenericArray<{name:string, age:number}>  = [
        {
            name: 'Mezba',
            age: 100,
        },
        {
            name: 'Jhankar',
            age: 110,
        },
    ]
    //use of interface-----23
    interface User  {
        name: string;
        age:number;
    }
    const user2 :GenericArray<User>  = [
        {
            name: 'Mezba',
            age: 100,
        },
        {
            name: 'Jhankar',
            age: 110,
        },
    ]
    //generic tuple
    type GenericTuple<X,Y> = [X,Y]
    const manush :[string,string] =  ['Mr X', 'Ms Y']
    const manush2 :GenericTuple<string,string> =  ['Mr X', 'Ms Y'] // use of tuple
    const UserWithID :GenericTuple<number , {name:string, email:string}>  = [1234, {name: 'persian' , email: 'a@gmail.com'} ] // use of tuple

}   