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
    addBalance(newBalance:number):string{
        return `My total Balance is : ${this.balance + newBalance}`;
    }

}