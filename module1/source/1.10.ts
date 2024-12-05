{
    //UNION TYPES------
    type FrontendDeveloper = 'inattentive' | 'juniorDeveloper'
    type FullstackDeveloper = 'frontendDeveloper' | 'expertDeveloper'

    type Developer = FrontendDeveloper | FullstackDeveloper

    const newDeveloper : FrontendDeveloper = 'inattentive'
    type User = {
        name: string;
        email?: string;
        gender: "male" | "female" ;
        bloodGroup: "O+" | "A+" | "AB+"
    }
    const user1: User = {
        name: 'persi',
        gender: 'male',
        bloodGroup: 'O+'
    }

    // INTERSECTION TYPE--------
    //---------
}