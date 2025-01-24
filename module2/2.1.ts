{
    //
    //type assertion
    let anything : any;
    anything = "Next Level Web Development";
    anything = true;
    (anything as string).charAt(0)

    const kgToGram = (value:string | number ) =>{
        if(typeof value === 'string'){
            const convertedValue = parseFloat(value)*1000
            return `the converted value is  ${convertedValue} `;
        }
        if(typeof value === "number"){
            return value*1000
        }
    }
    //
}