//BASIC DATA TYPE
//STRING

let firstName :string = 'faria'
//number
let roll:number = 123
//boolean
let isAdmin:boolean = true
//undefined
let x: undefined = undefined
//null
let y:null = null

//any type----NOT---RECOMMENDED
let d:number;
d=123


//NON---PRIMITIVE---DATA---TYPE
let friends:string[] = ['rachel','monica']
let eligibleRoll: number[] = [1,3]
eligibleRoll.push(2)

//tuple----specific type of array----type of value will follow an order
let coordinate : [number,number] = [1,5]
let ageName: [number,string,boolean] = [50, 'Mr.X',true]
ageName[0]=54