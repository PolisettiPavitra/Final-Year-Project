

// My Profile & My Home buttons
const myProfileBtn = document.getElementById("myProfileBtn");
if (myProfileBtn) {
    myProfileBtn.addEventListener("click", () => {
        alert("Redirecting to My Profile...");
    });
}

const myHomeBtn = document.getElementById("myHomeBtn");
if (myHomeBtn) {
    myHomeBtn.addEventListener("click", () => {
        alert("Redirecting to My Home...");
    });
}

// Modal logic for child cards
document.querySelectorAll('.child-card').forEach(card => {
    card.addEventListener('click', function() {
        document.getElementById('modalName').textContent = this.dataset.name;
        document.getElementById('modalAge').textContent = 'Age: ' + this.dataset.age;
        document.getElementById('modalCountry').textContent = 'Country: ' + this.dataset.country;
        document.getElementById('childModal').style.display = 'block';
    });
});

// Close modal when clicking the close button
const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
    closeModalBtn.onclick = function() {
        document.getElementById('childModal').style.display = 'none';
    };
}

// Optional: Close modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById('childModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};