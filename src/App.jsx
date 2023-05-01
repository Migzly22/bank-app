import { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard';

class User {
  //Constructor for the User Class
  constructor(uEmail,password, name, balance, expenseItems = []) {
      this.uEmail = uEmail;
      this.password = password;
      this.name = name;
      this.balance = balance;
      this.expenseItems = expenseItems;
  }
  // function to add expense items in the list
  addExpenses(newexpenseItem){

      this.expenseItems.push(newexpenseItem);

      // transform the balance and amount to float data type
      let num1 = parseFloat(this.balance)
      let num2 = parseFloat(newexpenseItem.cost)
      // the neww value of user balance
      this.balance = (num1 - num2).toFixed(2)

   
  }
  // function to delete specific item in the list
  deleteExpenses(expenseItemName){
      //update the balance 
      this.expenseItems.filter(
        (expenseItem) => {
          if (expenseItem.uName === expenseItemName){
              // transform the balance and amount to float data type
              let num1 = parseFloat(this.balance)
              let num2 = parseFloat(expenseItem.cost)
              // the neww value of user balance
              this.balance = (num1 + num2).toFixed(2)
          }
        }
      );



      //remove the item in the list
      this.expenseItems = this.expenseItems.filter(
        (expenseItem) => expenseItem.uName !== expenseItemName
      );
  }
  // show the item list
  listExpenses(){
    return this.expenseItems
  }
}
class ExpenseItems {
  constructor(uName, cost, owner) {
      this.uName = uName;
      this.cost = cost;
      this.owner = owner;
  }
  // ??
  updateExpenses(expenses,oldid){
      //changes in the cost of the item
      let balancechange = 0

      expenses.filter(
        (expenseItem) => {
          if (expenseItem.uName === oldid){
              balancechange = expenseItem.cost - this.cost


              expenseItem.uName = this.uName
              expenseItem.cost = this.cost
          }
        }
      );

      return [expenses,balancechange]


  }
}

function App() {
  const [authUser, setUser] = useState(null) // check if the user is logged in
  const [expenses, setExpenses] = useState(null) // list of expenses container

  //set the value of the authUser 
  const HandleUserToken= (email, pass, uname, balance) =>{

    let storedData = JSON.parse(localStorage.getItem('UserDataList')) || [];
    let emailFilter = storedData.filter(data => data.email === email);

    if (emailFilter.length > 0){

      const User1  = new User(email, pass, uname, balance, emailFilter[0].expenses)
      // Change the expenses list
      setExpenses(User1.listExpenses())
      // Change the authUser value
      setUser(User1)
    }else{
      const User1  = new User(email, pass, uname, balance)

      // Change the expenses list
      setExpenses(User1.listExpenses())
      // Change the authUser value
      setUser(User1)
    }





 
  }

  // remove the current user / logout
  const HandleLogOut = ()=>{
    // Change the authUser value
    setUser(null)
  }

  //add items in the expenses
  const HandleAddItem = (Itemname, CostOfItem)=>{
    //Call the User class
    const useradd = new User(authUser.uEmail,authUser.password,authUser.name,authUser.balance,authUser.expenseItems)
    // Call the ExpenseItems class
    const expenditureadd = new ExpenseItems(Itemname, CostOfItem, authUser.name)
    // Add the items from ExpenseItems to the expenseItem of the User
    useradd.addExpenses(expenditureadd)
    // Change the authUser value
    setUser(useradd)
    // Change the expenses list
    setExpenses(useradd.listExpenses())
  }

  //Depositing the Money
  const HandleDeposit= (Amount)=>{
    // transform the balance and amount to float data type
    let num1 = parseFloat(authUser.balance)
    let num2 = parseFloat(Amount)
    // the neww value of user balance
    let newbalance = (num1 + num2).toFixed(2)
    //Call the User class
    const useradd = new User(authUser.uEmail,authUser.password,authUser.name,newbalance,authUser.expenseItems)
 
    setUser(useradd)
  }
  //Wtihdraw the Money
  const HandleWithdraw =(Amount)=>{
    // transform the balance and amount to float data type
    let num1 = parseFloat(authUser.balance)
    let num2 = parseFloat(Amount)
    // the neww value of user balance
    let newbalance = (num1 - num2).toFixed(2)
    //Call the User class
    const useradd = new User(authUser.uEmail,authUser.password,authUser.name,newbalance,authUser.expenseItems)
 
    setUser(useradd)
  }

  // Delete the specific item in the list
  const HandleDelete = (Itemname)=>{
    //Call the User class
    const itemdel = new User(authUser.uEmail,authUser.password,authUser.name,authUser.balance,authUser.expenseItems)
    // Delete the specific Item in the list
    itemdel.deleteExpenses(Itemname)
    // Change the authUser value
    setUser(itemdel)
    // Change the expenses list
    setExpenses(itemdel.listExpenses())
  }

  // Update the specific list
  const HandleUpdateList = (itemname, itemcost, currentname)=>{
    //create new item
    const expenditureupdate = new ExpenseItems(itemname, itemcost, authUser.name)


    //update the expenses
    let arrcon = expenditureupdate.updateExpenses(expenses,currentname)
    //update the balance depending on the changes in the cost
    let changeinbalance = parseFloat(authUser.balance) + parseFloat(arrcon[1])


    const userupdatelist = new User(authUser.uEmail,authUser.password,authUser.name, changeinbalance  ,arrcon[0])

    // Change the authUser value
    setUser(userupdatelist)


  }


      //fires every render
    useEffect(() => {

      // if there are no user
      if (authUser === null) return;

      let storedData = JSON.parse(localStorage.getItem('UserDataList')) || [];

      // check if the email already exists
      let emailFilter = storedData.filter(data => data.email === authUser.uEmail);

      if (emailFilter.length === 0) {
        let data1 = {
          email: authUser.uEmail,
          balance: authUser.balance,
          expenses: expenses
        }
        storedData.push(data1)
        localStorage.setItem('UserDataList', JSON.stringify(storedData));


      } else {
        // return new list of data of the UserDataList
        let newlist = storedData.map(data => {
          if (data.email === authUser.uEmail) {
            return {
              email: authUser.uEmail,
              balance: authUser.balance,
              expenses: expenses
            }
          }
          return data;
        });

        localStorage.setItem('UserDataList', JSON.stringify(newlist));

        // return new list of data of the Users
        let storedData2 = JSON.parse(localStorage.getItem('Users')) || [];
        let newlist1 = storedData2.map(data => {
          if (data.email === authUser.uEmail) {
            return {
              email: authUser.uEmail,
              balance: authUser.balance,
              name: authUser.name,
              password: authUser.password
            }
          }
          return data;
        });

        localStorage.setItem('Users', JSON.stringify(newlist1));
      }
    }, [authUser]);


  //check if the user is logged in or not
  if (authUser === null){
    //show the login page
    return (
      <>
        <LoginPage 
            HandleUserToken={HandleUserToken}
        
        />
      </>
    )
  }else{
    /**
     * show the dashboard 
     * HandleLogOut for logout function
     * HandleAddItem for add item function
     * HandleDeposit for the amount that will be deposited
     * HandleWithdraw for the amount that will be withdrawn
     * Expenditures for the list of expenses from listExpenses function
     * Balance will hold the users balance value
     */
    return (
      <>
        
        <Dashboard HandleLogOut={
            HandleLogOut} 
            HandleAddItem={HandleAddItem} 
            HandleDeposit = {HandleDeposit}
            HandleWithdraw = {HandleWithdraw}
            HandleDelete = {HandleDelete}
            HandleUpdateList = {HandleUpdateList}


            Expenditures = {expenses}
            Balance={authUser.balance}

            
        />
      </>
    )
  }
}
export default App
