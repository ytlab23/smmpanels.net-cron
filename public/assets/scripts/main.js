// continous Time in Admin Dashboard 
function updateTime() {
   var timeString
   const now = new Date();
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   const seconds = String(now.getSeconds()).padStart(2, '0');
   if (hours > 12) {
      timeString = `${hours - 12}:${minutes}:${seconds} PM`;
   }
   else
      timeString = `${hours}:${minutes}:${seconds} AM`;


   const year = now.getFullYear();
   /* const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed */
   const day = String(now.getDate()).padStart(2, '0');
   const dayOfWeek = now.getDay();
   const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   const weekdayName = weekdays[dayOfWeek];

   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   const monthName = monthNames[now.getMonth()];
   const fullDate = `${weekdayName}, ${day} ${monthName} ${year}`;

   document.querySelector('.admin-greetings .time-wrapper .time').textContent = timeString;
   document.querySelector('.admin-greetings .time-wrapper .date').textContent = fullDate;
}

function forceLower(strInput) {
   strInput.value = strInput.value.toLowerCase();
}

function allowServiceCardClick(serviceContainer) {
   const allServicesCards = document.querySelectorAll(`${serviceContainer} article`);
    allServicesCards.forEach(servicesCard => {
        servicesCard.addEventListener("click", ()=>{
            servicesCard.children[0].click();
        })
    })
}

function bringToView(sectionElement){
   /* if(window.innerWidth < 900){
       responsiveMenuBar.classList.add("translate-x-full");
       menuBtn.children[0].classList.remove("hidden");
           menuBtn.children[1].classList.add("hidden");

   } */
   element = document.querySelector(sectionElement);
   console.log(element);
   element.scrollIntoView();
}