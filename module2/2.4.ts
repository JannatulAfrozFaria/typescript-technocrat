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
    const poorDeveloper: Developer<{
        brand: string;
        model: string;
        display:string;
    }> = {
        name: 'Per',
        computer: {
            brand: 'Asus',
            model: 'X-255UR',
            releaseYear: 2013,
        },
        smartWatch: {
            brand:'Emilab',
            model:'kw66',
            display: 'OLED'
        }
    }
    const richDeveloper: Developer<{
        brand: string;
        model: string;
        heart
    }> = {
        name: 'Eich Dev',
        computer: {
            brand: 'HP',
            model: 'X-255UR',
            releseYear: 2018
        },
        smartWatch: {
            brand:'Apple Watch',
            model:'kw66',
            heartTrack: true,
            sleepTrack: true,
        }
    }
    //
}