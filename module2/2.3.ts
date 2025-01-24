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

}