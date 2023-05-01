import '../css/dashboard.css'


function Dashboard({HandleLogOut,HandleAddItem,HandleDeposit,HandleWithdraw,HandleDelete,HandleUpdateList,Expenditures,Balance}){

    //modal for deposite amount using sweetalert
    const Deposit= async()=>{
        let money = 0
        // SweetAlert
        const { value: inputmoney } = await Swal.fire({
            title: 'Enter the Amount you want to deposit.',
            input: 'number',
            inputPlaceholder: '0'
          })
          
          if (inputmoney > 0) {
            //transform the value of inputmoney to float with 2 decimal point
            money = (parseFloat(inputmoney)).toFixed(2)
            Swal.fire({
                icon: 'success',
                text: `You've Successfully Deposited : ₱ ${money}`,
                showConfirmButton: false,
            })

            HandleDeposit(money)

          }else if (inputmoney < 0){
            await Swal.fire({
                icon: 'warning',
                text: "Please Enter Correct Value.",
                showConfirmButton: false,
            })
          }
    }
    //modal for Withdraw  using sweetalert
    const Withdraw= async()=>{
        let money = 0
        //SweetAlert
        const { value: inputmoney } = await Swal.fire({
            title: 'Enter the Amount you want to deposit.',
            input: 'number',
            inputPlaceholder: '0'
          })

          if (inputmoney > 0 && parseFloat(Balance) >= inputmoney) {
            //transform the value of inputmoney to float with 2 decimal point
            money = (parseFloat(inputmoney)).toFixed(2)
            Swal.fire({
                icon: 'success',
                text: `You've Successfully Withdrawn : ₱ ${money}`,
                showConfirmButton: false,
            })

            HandleWithdraw(money)


          }else if(inputmoney < 0){
            await Swal.fire({
                icon: 'warning',
                text: "Please Enter Correct Value.",
                showConfirmButton: false,
            })
          }else if (parseFloat(Balance) < inputmoney){
            await Swal.fire({
                icon: 'warning',
                text: "You've exceed the maximum amount of your Balance.",
                showConfirmButton: false,
            })
          }
    }
    //Add items in the expense lists
    const AddItemModal=async()=>{

        //sweet alert
        const { value: formValues } = await Swal.fire({
            title: 'Add Expenses',
            html:
              '<input id="swal-input1" class="swal2-input" placeholder="Item Name">' +
              '<input id="swal-input2" type="number" class="swal2-input" placeholder="Cost">',
            focusConfirm: false,
            confirmButtonText:"Add Item",
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
              ]
            }
        })
        
 
        if (formValues){
            let valuecontainer = formValues

            //validate if the name of the item exist in the list
            let bool1 = Expenditures.filter(
                (expenseItem) => expenseItem.uName === valuecontainer[0]
            );

            if (bool1.length != 0){
                Swal.fire({
                    icon: 'info',
                    text: `The item name already exist in the List`,
                    showConfirmButton: false,
                })

                return
            }

            //check if the itemmname and cost has a value
            if (valuecontainer[0] != "" && valuecontainer[1] != "" && parseFloat(valuecontainer[1]) >= 0) {
                Swal.fire({
                    icon: 'success',
                    text: `Success`,
                    showConfirmButton: false,
                })

                HandleAddItem(valuecontainer[0],valuecontainer[1]);

            }else{
                Swal.fire({
                    icon: 'info',
                    text: `Wrong Inputs. Please Try Again.`,
                    showConfirmButton: false,
                })
            }
        }

        

    }
    //delete item in the list
    const DeleteItem =(itemid) =>{
        HandleDelete(itemid)
    }
    //update item in the list
    const UpdateItem = async(itemname, itemcost)=>{
        let oldname = itemname
        const { value: formValues } = await Swal.fire({
            title: 'Add Expenses',
            html:
              `<input id="swal-input1" class="swal2-input" placeholder="Item Name" value="${itemname}">` +
              `<input id="swal-input2" type="number" class="swal2-input" placeholder="Cost" value="${itemcost}">`,
            focusConfirm: false,
            confirmButtonText:"Update Item",
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
              ]
            }
        })
        
 
        if (formValues){
            let valuecontainer = formValues

            //validate if the name of the item exist in the list
            let bool1 = Expenditures.filter(
                (expenseItem) => oldname !== expenseItem.uName && expenseItem.uName === valuecontainer[0] 
            );

            if (bool1.length != 0){
                Swal.fire({
                    icon: 'info',
                    text: `The item name already exist in the List`,
                    showConfirmButton: false,
                })

                return
            }

            //check if the itemmname and cost has a value
            if (valuecontainer[0] != "" && valuecontainer[1] != "" && parseFloat(valuecontainer[1]) >= 0) {
                Swal.fire({
                    icon: 'success',
                    text: `Update Successfully`,
                    showConfirmButton: false,
                })

                HandleUpdateList(formValues[0],formValues[1],itemname)

            }else{
                Swal.fire({
                    icon: 'info',
                    text: `Wrong Inputs. Please Try Again.`,
                    showConfirmButton: false,
                })
            }

           
        }



    }

    return ( 
        <>
            <nav className='DashboardInit'>
                <div className="logo">MCS Bank</div>
                <div className="dropdown">
                    <div className="dropbtn"><i className="fa-solid fa-circle-user"></i></div>
                    <div className="dropdown-content">
                        <a href="#">Account</a>
                        <a href="#" onClick={HandleLogOut}>Logout</a>
                    </div>
                </div>
            </nav>

            <section className="mainbody DashboardInit">  
                <div className="card">
                    <div className="cardinfo">
                        <div className="balancecontainer">
                            <h1>₱ {Balance}</h1>
                        </div>
                        <div className="cardinformation">
                            <div className="leftside">
                                <div className='banknum'>
                                    6353 7863 5247 9781
                                </div>
                                <div className="expiredate">
                                    01/26
                                </div>
                            </div>
                            <div className="rightside">
                                VISA
                            </div>
                        </div>
                    </div>
                    <div className="cardbtn">
                        <div onClick={Deposit}>
  
                                <i className="fa-solid fa-circle-dollar-to-slot"></i>
                                Deposit
                        </div>
                        <div onClick={Withdraw}>
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                Withdraw
                        </div>
                        <div>
                                <i className="fa-solid fa-paper-plane"></i>
                                Send Money
            
                        </div>
                        <div>
                 
                                <i className="fa-solid fa-user-group"></i>
                                Friend
                  
                        </div>
                    </div>
                </div>
                <div className="expensesmain">
                    <div className="expenseheader">
                        <h1>Expenses</h1>
                        <div className="addexpense" onClick={AddItemModal}>
                            <i className="fa-solid fa-square-plus"></i>
                        </div>
                    </div>
                    <div className="expensetable">
                        <table>
                            <thead>                               
                                <tr>
                                    <th>Item Name</th>
                                    <th>Cost</th>
                                    <th>Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Expenditures.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{textAlign: 'center'}}>NONE</td>
                                    </tr>
                                ) : (
                                    Expenditures.map((expense) => (
                                        <tr>
                                            <td>{expense.uName}</td>
                                            <td>₱ {expense.cost}</td>
                                            <td className='Listbtn'>
                                                <i className="fa-solid fa-pen-to-square" onClick={()=>{
                                                    UpdateItem(expense.uName, expense.cost)
                                                }}></i>
                                                <i className="fa-solid fa-trash" onClick={()=>{
                                                    DeleteItem(expense.uName)
                                                }}></i>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                </div>

            </section>






        </>
    );
}
 
export default Dashboard;