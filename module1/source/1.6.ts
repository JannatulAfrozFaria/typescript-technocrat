//FUNCTION
//1.Normal Function
//2.Arrow Function

function add(num1:number,num2:number=10):number{
    return num1+num2;
}
add(2,5)

//Arrow function
const addArrow = (num1:number,num2:number):number=>num1+num2

//object-->function--->method
const poorUser = {
    name: 'Mezba',
    balance:0,
    addBalance(newBalance:number):string{     //add balance is a METHOD
        return `My total Balance is : ${this.balance + newBalance}`;
    }
}


//CALL---BACK---FUNCTION
//create an array so thtat each element of given array is squared in the new array
const arr : number[] = [1,3,5]
const newArray = arr.map((element:number):number =>element*element );