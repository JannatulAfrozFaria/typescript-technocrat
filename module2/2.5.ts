{
    //function with generics
    const createArray = (param:string) : string[] =>{
        return [param]
    }
    const createArrayWithGeneric = <T> (param:T) : T[] =>{
        return [param]
    }
    const res1 = createArray('Bangladesh')
    const resGeneric = createArrayWithGeneric<boolean>(true);
    const resGeneric1 = createArrayWithGeneric<string>('Bangladesh');
    //
}