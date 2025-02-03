{
    //constraint
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