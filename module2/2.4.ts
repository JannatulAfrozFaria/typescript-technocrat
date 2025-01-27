{
    //interface------generic
    interface Developer<T> {
        name: string;
        computer: {
            brand:string;
            model: string;
            releaseYear: number
        };
        smartWatch: T;
    }
    const poorDeveloper: Developer<> = {
        name: 'Per',
        computer: {
            brand: 'Asus',
            model: 'X-255UR',
            releseYear: 2013
        },
        smartWatch: {
            brand:'Emilab',
            model:'kw66',
            display: 'OLED'
        }
    }
    //
}