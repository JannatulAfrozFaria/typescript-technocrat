{
    //interface------generic3
    interface Developer<T> {
        name: string;
        computer: {
            brand:string;
            model: string;
            releaseYear: number
        };
        smartWatch: T;
    }
    type EmilabWatch = {
        brand: string;
        model: string;
        display:string;
    }
    const poorDeveloper: Developer<EmilabWatch> = {
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
        heartTrack: boolean;
        sleepTrack:boolean;
    }> = {
        name: 'Eich Dev',
        computer: {
            brand: 'HP',
            model: 'X-255UR',
            releaseYear: 2018,
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