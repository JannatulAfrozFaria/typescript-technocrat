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
    type UserName = string
    const user: UserName = 'Persi'
}