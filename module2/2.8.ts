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

    
}