const daysList = document.getElementById('days');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('previous-month');
const nextBtn = document.getElementById('next-month');

let date = new Date();

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function renderCalendar() {
  daysList.innerHTML = '';

  const month = date.getMonth();
  const year = date.getFullYear();

  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();


  for (let i = 0; i < firstDay; i++) {
    const beforeFirstday = document.createElement('div');
    beforeFirstday.classList.add('empty');
    daysList.appendChild(beforeFirstday);
  }

  for (let day = 1; day <= lastDate; day++) {
    const li = document.createElement('div');
    li.textContent = day;
    daysList.appendChild(li);
  }
}
prevBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();


daysList.addEventListener('click', (e) => {
  if (e.target.classList.contains('empty')) return;
  const selected = daysList.querySelector('.selected');

  if (selected) selected.classList.remove('selected');
  e.target.classList.add('selected');

  const day = Number(e.target.textContent);
  date.setDate(day);
});