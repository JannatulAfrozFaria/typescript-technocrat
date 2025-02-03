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
    const resGenericString = createArrayWithGeneric<string>('Bangladesh');
    const resGenericObject = createArrayWithGeneric<string>({id:222,name:'Mr'});
    //
}