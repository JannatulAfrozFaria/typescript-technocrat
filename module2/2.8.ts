{
    type Something = {something:string};
    //PROMISE
    const createPromise = ():Promise<Something>  =>{
        return new Promise<Something> ((resolve, reject)=>{
            const data: Something = { something: "one"}
            if(data){
                resolve(data)
            }else{
                reject('f')
            }
        })
    }

    //calling create promise function
    const showData = async(): Promise<Something> =>{
        const data : Something = await createPromise();
        return data;
        console.log(data)
    }
    showData();
}