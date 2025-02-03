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


    const createArrayWithTuple = <T,Q> (param1:T, param2:Q) : [T,Q] =>{
        return [param1,param2]
    }
    const resT1 = createArrayWithTuple<string,number> ('Bangladesh',222)
    const resGenericStringT = createArrayWithTuple<string,string>('Bangladesh','Asia');
    const resGenericStringObjectT = createArrayWithTuple<string,{name:string}>('Bangladesh',{name:'Asia'});

    const addCourseToStudent =<T> (student: T) =>{
        const course = 'Next Level Web Development'
        return{
            ...student,
            course
        }
    }
    const student1 = addCourseToStudent({name:'M0',email:'gmail', devType:'Next'})
    const student2 =addCourseToStudent({name:'Y',email:'yahoo',devType:'basic',hasWatch:'Apple'})
    //
}