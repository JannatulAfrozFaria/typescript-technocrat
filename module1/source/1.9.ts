{
    //TYPE ALIAS-------
    
    const student1: {
        name: string;
        age: number;
        gender: string;
        contactNo: string;
        address: string;
    } = {
        name: 'Mezba',
        age: 50,
        gender: 'male',
        contactNo: 'o17sssssss',
        address: 'ctg',
    };

    //CREATING A TYPE----
    type Student = {
        name: string;
        age: number;
        gender: string;
        contactNo?: string;
        address: string;
    }
    const student2: Student = {
        name: 'MIR',
        age: 40,
        gender: 'male',
        address: 'dhaka'
    }
    //EXAMPLE-----2
    type UserName = string
    const user: UserName = 'Persi'
    //EXAMPLE---3
    type IsAdmin = boolean
    const isAdmin : IsAdmin = true
    //EXAMPLE---4
    type AddFunction = (num1: number,num2: number) => number;
    const add: AddFunction = (num1,num2) => num1 + num2;
    //--
}