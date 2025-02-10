{
    //generic constraint with keyof operator
    type Vehicle = {
        bike: string;
        car: string;
        ship: string;
    }
    type Owner = "bike" | "car" | "ship" ; //manually
    type Owner2 = keyof Vehicle
    const person1:Owner2 = ""
    const user = {
        name: 'Mr. persi',
        age: 27,
        address: 'ctg'
    }
    user['name']
    //
}