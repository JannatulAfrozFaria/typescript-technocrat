{
    //generic constraint with keyof operator
    type Vehicle = {
        bike: string;
        car: string;
        ship: string;
    }
    type Owner = "bike" | "car" | "ship" ; //manually
    type Owner2 = keyof Vehicle

    const getPropertyValue = <X,Y extends keyof X> (obj: X, key: Y)=>{
        return obj[key];
    }

    const user = {
        name: 'Mr. persi',
        age: 27,
        address: 'ctg'
    }
    const result = getPropertyValue(user,'name');
    
    const result1 = getPropertyValue(car,'year');
}