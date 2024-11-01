{
    //destructuring
    const user = {
        id:345,
        name:{
            firstName: 'Mezbaul',
            middleName: 'Abedin',
            lastName: 'Persian',
        },
        contactNo: "01XXXXXXXX",
        address: 'Uganda',
    };

    //destructuring the properties
    const{
    contactNo,
    name:{middleName}
    } = user;
}

