{
    

    //callling create promise function
    const showData = async() =>{
        const data = await createPromise()
        console.log(data)
    }
    showData();
}