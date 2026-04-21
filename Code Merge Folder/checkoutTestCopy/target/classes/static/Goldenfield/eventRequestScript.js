   //Elements by Id
            //Fieldset 1
            const form = document.getElementById('form');
            const eventType = document.getElementById('eventType');
            const performers = document.getElementById('performers');
            const startDate = document.getElementById('startDate');
            const startTime = document.getElementById('startTime');
            const attendance = document.getElementById('attendance');
            const ages = document.getElementById('ages');
            const otherLabel = document.getElementById('otherLabel');
            const budget = document.getElementById('budget');
            const eventDetails = document.getElementById('eventDetails');

            //Fieldset 2
            const company = document.getElementById('company');
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const emailMessage = document.getElementById('emailMessage');
            const contactTime = document.getElementById('contactTime');
            const links = document.getElementById('links');
            const contactNotes = document.getElementById('contactNotes');

            //Elements by class
            const classHidden = document.getElementsByClassName('hidden');

            // const responseMessage = document.getElementById('responseMessage');


            //Display input in user selects "Other"
            ages.addEventListener('change', () => {
                if (ages.value === 'other') {
                    for (let elm of classHidden) {
                        elm.style.display = 'inline';
                    }
                }
                else {
                    for (let elm of classHidden) {
                        elm.style.display = 'none';
                    }
                }
            });


            //Display alert if email address is invalid
            email.addEventListener('change', () => {
                const emailValue = email.value;
                if (/^[^@]+@[^@]+\.[^@]+$/.test(emailValue)) {
                    emailMessage.style.display = 'none';
                } else {
                    emailMessage.style.display = 'block';
                    emailMessage.textContent = "Please enter a valid email address";
                }
            });


            //Prevent user from being able to select a date that has already occurred in real time
            startDate.addEventListener('click', minDate);
            function minDate() {
                const today = new Date();
                const mm = String(today.getMonth() + 1).padStart(2,'0');
                const dd = String(today.getDate() + 1).padStart(2,'0');
                const yyyy = today.getFullYear();

                const todayString = `${yyyy}-${mm}-${dd}`;
                startDate.min = todayString;
            }

            form.addEventListener('submit', function(event) {
                event.preventDefault(); //Prevent default form submission

                const eventData = {
                    eventType: eventType.value,
                    performers: performers.value,
                    startDate: startDate.value,
                    startTime: startTime.value,
                    attendance: attendance.value,
                    ages: ages.value,
                    otherLabel: otherLabel.value,
                    budget: budget.value,
                    eventDetails: eventDetails.value,
                    company: company.value,
                    firstName: firstName.value,
                    lastName: lastName.value,
                    phone: phone.value,
                    email: email.value,
                    contactTime: contactTime.value,
                    links: links.value,
                    contactNotes: contactNotes.value
                }

                console.log(eventData);


                //Send event data
                fetch('http://localhost:8080/api/eventrequest', {  //Replace these :8080/as/needed
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                }).then(response => response.text())
                        .then(data => alert(data))
                        .catch(error => console.error('Error:', error));


            });