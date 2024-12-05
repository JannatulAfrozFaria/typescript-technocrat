{ //<----to avoid the scope related error


    //SPREAD OPERATOR
    const bros1:string[] = ['Mir','Firoz','Mizan']
    const bros2:string[] = ['Tanmoy','Nahid','Rahat']

    bros1.push(...bros2) //---SPREAD OPERATOR CONVERTS THE ARRAY TO STRINGSS
    console.log(bros1.push(...bros2))

    const mentors = {
        typecript: 'Mexba',
        redux: 'Mir',
        dbms: 'Mizan'
    }
    const mentors1 = {
        prisma: 'Firoz',
        next: 'Tanmoy',
        cloud: 'Nahid'
    }
    const mentorList = {
        ...mentors,
        ...mentors1,
    }
    
    //REST OPERATOR
    const greetFriends = (...friends:string[]) =>{
        // console.log(`Hi ${friend1} ${friend2} ${friend3} `);
        friends.forEach((friend:string)=> console.log(`Hi ${friend}`))
    };
    greetFriends("Abul","Kabul","Apu")
    
    //DESTRUCTURING
    
}