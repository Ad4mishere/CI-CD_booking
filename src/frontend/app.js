const schedule = document.getElementById("schedule");
const bookButton = document.getElementById("book-btn");
const statusText = document.getElementById("status");

let selectedTimeSlotId = null;
let rescheduleOrderNumber = null;


async function loadTimeSlots() {
  const response = await fetch("/api/time-slots");
  const data = await response.json();

  schedule.innerHTML = "";

  const groupedByDate = {};

  for (const slot of data) {
    if (!groupedByDate[slot.date]) {
      groupedByDate[slot.date] = [];
    }
    groupedByDate[slot.date].push(slot);
  }

  for (const date in groupedByDate) {
    const daySection = document.createElement("div");
    daySection.className = "day";

    const heading = document.createElement("h2");
    heading.textContent = date;

    const slotsContainer = document.createElement("div");
    slotsContainer.className = "slots";

    for (const slot of groupedByDate[date]) {
      const slotDiv = document.createElement("div");
      slotDiv.className = "slot";
      slotDiv.textContent = slot.start_time;
      slotDiv.dataset.id = slot.id;

      slotDiv.onclick = () => {
        selectedTimeSlotId = slot.id;
        highlightSelected();
      };

      slotsContainer.appendChild(slotDiv);
    }

    daySection.appendChild(heading);
    daySection.appendChild(slotsContainer);
    schedule.appendChild(daySection);
  }
}

function highlightSelected() {
  const allSlots = document.querySelectorAll(".slot");

  for (const slot of allSlots) {
    slot.classList.remove("selected");
  }

  for (const slot of allSlots) {
    if (Number(slot.dataset.id) === selectedTimeSlotId) {
      slot.classList.add("selected");
    }
  }
}

async function bookSelectedTime() {

     if (selectedTimeSlotId === null) {
    statusText.textContent = "Välj en tid först";
    return;
  }

  // 🟡 OMBOKNING (PUT)
  if (rescheduleOrderNumber) {
    statusText.textContent = "Bokar om...";

    const response = await fetch(
      `/api/bookings/${rescheduleOrderNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          newTimeSlotId: selectedTimeSlotId
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      statusText.textContent = data.error || "Kunde inte boka om";
      return;
    }

    statusText.textContent = "Bokningen är ombokad";

    rescheduleOrderNumber = null;
    selectedTimeSlotId = null;
    loadTimeSlots();
    return;
  }
  statusText.textContent = "Bokar...";

  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      timeSlotId: selectedTimeSlotId
    })
  });

  const data = await response.json();

  if (!response.ok) {
    statusText.textContent = data.error || "Något gick fel";
    return;
  }

  statusText.textContent = `Bokning klar! Ordernummer: ${data.orderNumber}`;

  selectedTimeSlotId = null;
  loadTimeSlots();
}

bookButton.onclick = () => {
  if (selectedTimeSlotId === null) {
    statusText.textContent = "Välj en tid först";
    return;
  }

  bookSelectedTime();
};


const manageBookingBtn = document.getElementById("manage-booking-btn");
const modal = document.getElementById("manageBookingModal");

manageBookingBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});


const closeManageBookingBtn = document.getElementById("closeManageBookingBtn");

closeManageBookingBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

const cancelBookingBtn = document.getElementById("cancelBookingBtn");
const orderNumberInput = document.getElementById("orderNumberInput");
const manageBookingMessage = document.getElementById("manageBookingMessage");

cancelBookingBtn.addEventListener("click", async () => {
  const orderNumber = orderNumberInput.value.trim();

  if (!orderNumber) {
    manageBookingMessage.textContent = "Ange ett ordernummer";
    return;
  }

  manageBookingMessage.textContent = "Avbokar...";

  const response = await fetch(`/api/bookings/${orderNumber}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (!response.ok) {
    manageBookingMessage.textContent = data.error || "Kunde inte avboka";
    return;
  }

  manageBookingMessage.textContent = "Bokningen är avbokad";

  orderNumberInput.value = "";
  loadTimeSlots();

  setTimeout(() => {
    modal.classList.add("hidden");
    manageBookingMessage.textContent = "";
  }, 3000);
});


const rescheduleBookingBtn = document.getElementById("rescheduleBookingBtn");

rescheduleBookingBtn.addEventListener("click", () => {
  const orderNumber = orderNumberInput.value.trim();

  if (!orderNumber) {
    manageBookingMessage.textContent = "Ange ett ordernummer";
    return;
  }

  rescheduleOrderNumber = orderNumber;

  manageBookingMessage.textContent =
    "Välj en ny tid i listan och klicka på 'Boka vald tid'";

  modal.classList.add("hidden");
});

loadTimeSlots();


