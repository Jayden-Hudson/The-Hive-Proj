 //eventrequests
  fetch("http://localhost:8080/api/dashboard")
   .then(res => res.json())
   .then(data => {

       let html = '';
       data.forEach(item => {
           html += `
           <tr>
               <td>${item.eventtype}</td>
               <td>${item.performers}</td>
               <td> ${item.expectedattendance}</td>
               <td>${item.agerange}</td>
               <td> ${item.eventbudget}</td>
               <td> ${item.starttime}</td>
               <td> ${item.startdate}</td>
               <td>${item.additionaleventdetails}</td>
           </tr>
           `;
       });

       document.getElementById("eventRequestListTable").innerHTML = html;

   })
   .catch(error => console.log(error));

//buyers table
fetch("http://localhost:8080/api/buyers")
.then(res => res.json())
.then(data => {

    let html = '';

    data.forEach(item => {
        html += `
            <tr>
                <td>${item.firstname} ${item.lastname}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
            </tr>
        `;
    });

    document.getElementById("CustomerListTable").innerHTML = html;

})
.catch(error => console.log(error));




//employee table
fetch("http://localhost:8080/api/employees/dashboard")
.then(res => res.json())
.then(data => {

    let html = '';

    data.forEach(item => {
        html += `
            <tr>
                <td>${item.firstname} ${item.lastname}</td>
                <td>${item.employeecode}</td>
                <td>${item.departmentname}</td>

            </tr>
        `;
    });

    document.getElementById("EmployeeList").innerHTML = html;

})
.catch(error => console.log(error));















//orders/transactions

fetch("http://localhost:8080/api/orders")
.then(res => res.json())
.then(data => {

    let html = '';

    let max = Math.max(...data.map(x => x.ordertotal));




    data.forEach(item => {
    //show only 10
    //data.slice(0,5).forEach((item,index)=>{

        let height = (item.ordertotal / max) * 500;

        html += `
            <div class="bar-box">
                <div class="bar" style="height:${height}px"></div>
                <p>orderId:${item.orderid}</p>
                <small>${item.orderdate}</small>
                <br>
                <h3>$${item.ordertotal}</h3>
            </div>
        `;
    });

     document.getElementById("ordersBar").innerHTML = html;

 })
 .catch(error => console.log(error));
