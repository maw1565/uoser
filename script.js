const navItems = document.querySelectorAll(".nav-item");
const toast = document.getElementById("toast");
const actionBtns = document.querySelectorAll(".action-btn");
let toastTimeout;

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // Prevent action if already active
    if (item.classList.contains("active")) return;

    // Change active state
    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    // Handle sections
    const targetId = item.getAttribute("data-target");
    if (targetId) {
      document.querySelectorAll(".page-section").forEach((sec) => {
        sec.classList.remove("active");
      });
      document.getElementById(targetId).classList.add("active");
    }
  });
});

let cart = [];
const cartBadge = document.getElementById("cart-badge");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartTotalPrice = document.getElementById("cart-total-price");
const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

function updateCartUI() {
  // Update Badge
  cartBadge.textContent = cart.length;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">السلة فارغة حالياً</p>';
    cartTotal.style.display = "none";
    return;
  }
  
  cartTotal.style.display = "block";
  cartItemsContainer.innerHTML = "";
  let total = 0;
  
  cart.forEach((item, index) => {
    total += parseInt(item.price);
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span class="price">${parseInt(item.price).toLocaleString()} د.ع</span>
      </div>
      <button class="cart-item-remove" data-index="${index}">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
  
  cartTotalPrice.textContent = total.toLocaleString();
  
  // Attach remove events
  document.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      cart.splice(index, 1);
      updateCartUI();
      showToast("تم الحذف من السلة");
    });
  });
}

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const name = btn.getAttribute("data-name");
    const price = btn.getAttribute("data-price");
    const img = btn.getAttribute("data-img");
    
    cart.push({ name, price, img });
    updateCartUI();
    showToast("تمت الإضافة للسلة");
  });
});

let pendingOrder = null;
const checkoutBtn = document.querySelector(".checkout-btn");
const pendingOrderContainer = document.getElementById("pending-order-container");
const currentCartContainer = document.getElementById("current-cart-container");
const checkoutFormContainer = document.getElementById("checkout-form-container");
const confirmCheckoutBtn = document.getElementById("confirm-checkout-btn");
const cancelCheckoutBtn = document.getElementById("cancel-checkout-btn");
const checkoutName = document.getElementById("checkout-name");
const checkoutAddress = document.getElementById("checkout-address");
const checkoutPhone = document.getElementById("checkout-phone");
const pendingOrderItems = document.getElementById("pending-order-items");
const skipPendingBtn = document.getElementById("skip-pending-btn");

function showPendingOrder() {
  if (pendingOrder && pendingOrder.length > 0) {
    pendingOrderContainer.style.display = "block";
    currentCartContainer.style.display = "none";
    if (checkoutFormContainer) checkoutFormContainer.style.display = "none";
    
    let itemsHtml = "";
    let total = 0;
    pendingOrder.forEach(item => {
      itemsHtml += `<div style="display: flex; justify-content: space-between; border-bottom: 1px solid #444; padding: 10px 0;">
        <span>${item.name}</span>
        <span style="color: #d4af37;">${parseInt(item.price).toLocaleString()} د.ع</span>
      </div>`;
      total += parseInt(item.price);
    });
    itemsHtml += `<div style="display: flex; justify-content: space-between; padding-top: 10px; font-weight: bold; margin-top: 5px;">
      <span>الإجمالي:</span>
      <span style="color: #d4af37;">${total.toLocaleString()} د.ع</span>
    </div>`;
    
    pendingOrderItems.innerHTML = itemsHtml;
  } else {
    pendingOrderContainer.style.display = "none";
    currentCartContainer.style.display = "block";
    if (checkoutFormContainer) checkoutFormContainer.style.display = "none";
  }
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    currentCartContainer.style.display = "none";
    checkoutFormContainer.style.display = "block";
  });
}

if (cancelCheckoutBtn) {
  cancelCheckoutBtn.addEventListener("click", () => {
    checkoutFormContainer.style.display = "none";
    currentCartContainer.style.display = "block";
  });
}

if (confirmCheckoutBtn) {
  confirmCheckoutBtn.addEventListener("click", () => {
    if (!checkoutName.value.trim() || !checkoutAddress.value.trim() || !checkoutPhone.value.trim()) {
      showToast("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    showToast("تم إرسال الطلب بنجاح");
    pendingOrder = [...cart];
    cart = [];
    updateCartUI();
    
    // Clear form
    checkoutName.value = "";
    checkoutAddress.value = "";
    checkoutPhone.value = "";
    
    showPendingOrder();
  });
}

if (skipPendingBtn) {
  skipPendingBtn.addEventListener("click", () => {
    pendingOrder = null;
    showPendingOrder();
  });
}

// Work Modal Logic
const workModal = document.getElementById("work-modal");
const closeWorkModalBtn = document.getElementById("close-work-modal");
const workModalImg = document.getElementById("work-modal-img");
const workModalTitle = document.getElementById("work-modal-title");
const workModalPrice = document.getElementById("work-modal-price");
const workModalDesc = document.getElementById("work-modal-desc");

document.querySelectorAll('.work-item').forEach(item => {
  item.addEventListener('click', () => {
    const title = item.getAttribute('data-title');
    const price = item.getAttribute('data-price');
    const img = item.getAttribute('data-img');
    const desc = item.getAttribute('data-desc');

    workModalTitle.textContent = title;
    workModalPrice.textContent = price;
    workModalImg.src = img;
    workModalDesc.textContent = desc;

    workModal.style.display = 'flex';
  });
});

if (closeWorkModalBtn) {
  closeWorkModalBtn.addEventListener('click', () => {
    workModal.style.display = 'none';
  });
}

if (workModal) {
  window.addEventListener('click', (e) => {
    if (e.target === workModal) {
      workModal.style.display = 'none';
    }
  });
}

// Banner Slider Logic
setInterval(() => {
  const slides = document.querySelectorAll(".slide");
  if (slides.length === 0) return;

  let activeIdx = -1;
  slides.forEach((s, i) => {
    if (s.classList.contains("active")) activeIdx = i;
  });
  if (activeIdx === -1) activeIdx = 0;

  const nextIdx = (activeIdx + 1) % slides.length;

  // Move current to the right (prev)
  slides[activeIdx].className = "slide prev";

  // Move next from left (-100%) to center (0)
  slides[nextIdx].className = "slide active";

  // Reset all other slides to the left side (-100%) without transition
  slides.forEach((s, i) => {
    if (i !== activeIdx && i !== nextIdx) {
      s.style.transition = "none";
      s.className = "slide next";
      void s.offsetWidth; // Force reflow
      s.style.transition = "";
    }
  });
}, 4000);

// Booking Wizard Logic
let currentStep = 1;
const bookingData = {
  services: [],
  specialist: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  notes: ""
};

const steps = document.querySelectorAll(".step");
const stepLines = document.querySelectorAll(".step-line");
const wizardSteps = document.querySelectorAll(".wizard-step");

function updateWizardUI() {
  // Update Stepper
  steps.forEach((step, idx) => {
    const stepNum = idx + 1;
    if (stepNum < currentStep) {
      step.classList.add("completed");
      step.classList.remove("active");
    } else if (stepNum === currentStep) {
      step.classList.add("active");
      step.classList.remove("completed");
    } else {
      step.classList.remove("active", "completed");
    }
  });

  stepLines.forEach((line, idx) => {
    if (idx + 1 < currentStep) {
      line.classList.add("active");
    } else {
      line.classList.remove("active");
    }
  });

  // Show Active Step
  wizardSteps.forEach(ws => ws.classList.remove("active"));
  
  if (currentStep <= 5) {
    document.getElementById(`step-${currentStep}`).classList.add("active");
  } else {
    document.getElementById("step-success").classList.add("active");
  }
}

// Next / Prev buttons
document.querySelectorAll(".next-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < 5) {
      currentStep++;
      updateWizardUI();
    }
  });
});

document.querySelectorAll(".prev-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateWizardUI();
    }
  });
});

// Step 1: Services
const serviceOptions = document.querySelectorAll("#services-options .option-card");
const step1Next = document.querySelector("#step-1 .next-btn");

serviceOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    opt.classList.toggle("selected");
    
    // Re-evaluate selected services
    bookingData.services = [];
    let totalPrice = 0;
    
    document.querySelectorAll("#services-options .option-card.selected").forEach(selectedOpt => {
      bookingData.services.push(selectedOpt.getAttribute("data-value"));
      totalPrice += parseInt(selectedOpt.getAttribute("data-price"));
    });
    
    const serviceNames = bookingData.services.length > 0 ? bookingData.services.join(" + ") : "---";
    document.getElementById("summary-service").textContent = serviceNames;
    document.getElementById("summary-price").textContent = totalPrice > 0 ? totalPrice.toLocaleString() + " د.ع" : "---";
    
    step1Next.disabled = bookingData.services.length === 0;
  });
});

// Step 2: Specialists
const specialistOptions = document.querySelectorAll("#specialists-options .option-card");
const step2Next = document.querySelector("#step-2 .next-btn");

specialistOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    specialistOptions.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    
    bookingData.specialist = opt.getAttribute("data-value");
    document.getElementById("summary-specialist").textContent = bookingData.specialist;
    
    step2Next.disabled = false;
  });
});

// Step 3: Date & Time
const dateOptions = document.querySelectorAll("#date-options .date-card");
const timeOptions = document.querySelectorAll("#time-options .time-slot");
const step3Next = document.querySelector("#step-3 .next-btn");

function checkStep3Valid() {
  if (bookingData.date && bookingData.time) {
    step3Next.disabled = false;
  }
}

dateOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    dateOptions.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    bookingData.date = opt.getAttribute("data-value");
    document.getElementById("summary-date").textContent = bookingData.date;
    checkStep3Valid();
  });
});

timeOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    timeOptions.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    bookingData.time = opt.getAttribute("data-value");
    document.getElementById("summary-time").textContent = bookingData.time;
    checkStep3Valid();
  });
});

// Step 4: Details
const nameInput = document.getElementById("booking-name");
const phoneInput = document.getElementById("booking-phone");
const notesInput = document.getElementById("booking-notes");
const step4Next = document.querySelector("#step-4 .next-btn");

function checkStep4Valid() {
  if (nameInput.value.trim() !== "" && phoneInput.value.trim() !== "") {
    step4Next.disabled = false;
  } else {
    step4Next.disabled = true;
  }
}

nameInput.addEventListener("input", () => {
  bookingData.name = nameInput.value.trim();
  document.getElementById("summary-name").textContent = bookingData.name || "---";
  checkStep4Valid();
});

phoneInput.addEventListener("input", () => {
  bookingData.phone = phoneInput.value.trim();
  checkStep4Valid();
});

notesInput.addEventListener("input", () => {
  bookingData.notes = notesInput.value.trim();
});

// Step 5: Submit
document.getElementById("submit-booking-btn").addEventListener("click", () => {
  currentStep = 6; // Success step
  updateWizardUI();
  
  const serviceNames = bookingData.services.join(" + ");
  const message = `مرحباً، أود تأكيد حجزي:
الخدمة: ${serviceNames}
المتخصصة: ${bookingData.specialist}
التاريخ: ${bookingData.date}
الوقت: ${bookingData.time}
الاسم: ${bookingData.name}
الرقم: ${bookingData.phone}
${bookingData.notes ? `ملاحظات: ${bookingData.notes}` : ''}
`;
  
  const whatsappUrl = `https://wa.me/9647762209987?text=${encodeURIComponent(message)}`;
  const whatsappLink = document.getElementById("whatsapp-confirm-link");
  if (whatsappLink) {
    whatsappLink.href = whatsappUrl;
  }
});

document.getElementById("new-booking-btn").addEventListener("click", () => {
  // Reset Wizard
  currentStep = 1;
  bookingData.services = [];
  bookingData.specialist = "";
  bookingData.date = "";
  bookingData.time = "";
  bookingData.name = "";
  bookingData.phone = "";
  bookingData.notes = "";
  
  serviceOptions.forEach(o => o.classList.remove("selected"));
  specialistOptions.forEach(o => o.classList.remove("selected"));
  dateOptions.forEach(o => o.classList.remove("selected"));
  timeOptions.forEach(o => o.classList.remove("selected"));
  
  nameInput.value = "";
  phoneInput.value = "";
  notesInput.value = "";
  
  step1Next.disabled = true;
  step2Next.disabled = true;
  step3Next.disabled = true;
  step4Next.disabled = true;
  
  document.getElementById("summary-service").textContent = "---";
  document.getElementById("summary-specialist").textContent = "---";
  document.getElementById("summary-date").textContent = "---";
  document.getElementById("summary-time").textContent = "---";
  document.getElementById("summary-name").textContent = "---";
  document.getElementById("summary-price").textContent = "---";
  
  updateWizardUI();
});

// Product Search Logic
const searchBtn = document.getElementById("search-btn");
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("product-search");
const productCards = document.querySelectorAll(".products .product-card");

searchBtn.addEventListener("click", () => {
  // Navigate to home section if not already there
  const homeTab = document.querySelector('.nav-item[data-target="home-section"]');
  if (homeTab && !homeTab.classList.contains('active')) {
    homeTab.click();
  }

  // Toggle search container
  if (searchContainer.style.display === "none") {
    searchContainer.style.display = "block";
    searchInput.focus();
  } else {
    searchContainer.style.display = "none";
    searchInput.value = "";
    // Reset search
    searchInput.dispatchEvent(new Event("input"));
  }
});

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();
  
  productCards.forEach(card => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    // Filter product from the first letter
    if (title.startsWith(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// End of script
