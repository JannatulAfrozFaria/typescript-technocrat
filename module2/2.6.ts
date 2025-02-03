{
    //constraint
    const addCourseToStudent =<T> (student: T) =>{
        const course = 'Next Level Web Development'
        return{
            ...student,
            course
        }
    }
    const student1 = addCourseToStudent({id:21,name:'M0',email:'gmail', devType:'Next'})
    const student2 =addCourseToStudent({id:22,name:'Y',email:'yahoo',devType:'basic',hasWatch:'Apple'})
    const student3 =addCourseToStudent({id:22,name:'Y',email:'yahoo',devType:'basic',hasWatch:'Apple'})
    //
}