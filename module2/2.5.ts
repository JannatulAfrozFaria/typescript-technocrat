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
    type User = {id:number; name: string}
    const resGenericObject = createArrayWithGeneric<User>({id:222,name:'Mr'});
    //
}