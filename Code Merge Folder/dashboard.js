



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




//soldout tickets
/*
function loadEventStats(eventId) {

    fetch(`http://localhost:8080/api/event/${eventId}/stats`)
        .then(res => res.json())
        .then(data => {

            document.getElementById("eventStatus").innerText =
                data.soldOut ? "SOLD OUT" : "AVAILABLE";
        })
        .catch(err => console.error(err));
}

*/


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





//orders(transactions)
fetch("http://localhost:8080/api/orders")
.then(res => res.json())
.then(data => {

    let html = '';

    let max = Math.max(...data.map(x => x.ordertotal));

    data.forEach(item => {

          let height = (item.ordertotal / max) * 300;

             const dateString = "12/05/2026";
             const [day, month, year] = item.orderdate.split("/");
             const date = new Date(year, month - 1, day);
             const monthName = date.toLocaleString('default', {
                 month: 'long'
             });

  //console.log(monthName);

                html += `
                    <div class="bar-box">
                        <div class="bar" style="height:${height}px">
                         <span class="totalbar-text">$${item.ordertotal}</span>

                        </div>

                        <small>${monthName}</small>
                        <br>

                    </div>

                `;


    });

     document.getElementById("ordersBar").innerHTML = html;



       // calculate revenue by year and ticketssold

             let ticketsSold = data.length;
                document.getElementById("ticketsSold").innerText = ticketsSold;

                // capacity)
                let totalCapacity = 1000;
                let ticketsAvailable = totalCapacity - ticketsSold;

                document.getElementById("ticketsAvailable").innerText = ticketsAvailable;


          // revenue
          const currentYear = new Date().getFullYear();
          let totalRevenue = 0;

          data.forEach(order => {
              const [day, month, year] = order.orderdate.split("/");
               const date = new Date(year, month - 1, day);
               if (date.getFullYear() === currentYear) {
                   totalRevenue += Number(order.ordertotal);
               }
           });

          document.getElementById("currentYear").innerText = currentYear;
          document.getElementById("yearRevenue").innerText =
              `$${totalRevenue.toLocaleString()}`;



 })
 .catch(error => console.log(error));


    //where userid is 8
       const userid = 8;

       fetch(`http://localhost:8080/api/orders/${userid}`)
       .then(res => res.json())
       .then(data => {

           let html = '';

           data.forEach(item => {
           html += `
                     <div class="order-card">
                         <h2>Order Confirmation: ${item.confirmationnum}</h2>
                          <h3><strong>Total:</strong> $${item.ordertotal}</h3>
                          <h3><strong>Date:</strong> ${item.orderdate}</h3>
                   </div>
               `;
           });

           document.getElementById("historyorder").innerHTML = html;

       })
       .catch(error => console.log(error));





