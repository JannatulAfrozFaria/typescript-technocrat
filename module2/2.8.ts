{
    //PROMISE
    const createPromise = ():Promise<string>  =>{
        return new Promise<string> ((resolve, reject)=>{
            const data: string = "something"
            if(data){
                resolve(data)
            }else{
                reject('failed to load data')
            }
        })
    }

    //callling create promise function
    const showData = async() =>{
        const data = await createPromise()
        console.log(data)
    }
    
}