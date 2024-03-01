document.addEventListener("DOMContentLoaded", function() {

    let cards = [];
    // Load cards from localStorage if available
    const cardsLS = localStorage.getItem("cards");
    if (cardsLS) {
        try {
            cards = JSON.parse(cardsLS);
            // Render existing cards on the page
            renderCards(cards);
        } catch (error) {
            console.error("Error parsing cards from localStorage:", error);
        }
    }

    function renderCards(cardsArray) {
        const cardContainer = document.querySelector('.card-container');
        cardContainer.innerHTML = cardsArray.map(card => card.html).join('');
    }

    function addEmployee(event) {
        event.preventDefault();
        // Generate a unique identifier for the card
        const timestamp = Date.now().toString();
        // Get form inputs
        const firstNameInput = document.querySelector('input[name="firstName"]');
        const lastNameInput = document.querySelector('input[name="lastName"]');
        const emailInput = document.querySelector('input[name="email"]');
        const phoneInput = document.querySelector('input[name="cellphone"]');
        const positionInput = document.querySelector('input[name="position"]');
        const genderInputs = document.querySelectorAll('input[name="gender"]');
        // Extract values
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const position = positionInput.value;
        let gender = '';
        genderInputs.forEach(input => {
            if (input.checked) {
                gender = input.value;
            }
        });
        if (!firstName || !lastName || !email || !phone || !position || !gender) {
            alert("Please fill out all fields.");
            return;
        }
        // Create a new employee card
        const newCardHTML = `
            <div class="card" data-id="${timestamp}">
                <div class="card__header">
                    <div class="card__info">
                        <h2 class="card__fullname">${firstName} ${lastName}</h2>
                        <p class="position">${position}</p>
                    </div>
                </div>
                <div class="card__contact">
                    <p class="card__email">Email: ${email}</p>
                    <p class="card__cellphone">Phone Number: ${phone}</p>
                    <p class="card__gender">Gender: ${gender}</p>
                </div>
                <div class="displayButtons">
                    <button class="editBtn">🖊️</button>
                    <button class="removeBtn">❌</button>
                </div>
            </div>
        `;
        const cardContainer = document.querySelector('.display__container');
        cardContainer.insertAdjacentHTML('beforeend', newCardHTML);
        cards.push({ id: timestamp, html: newCardHTML });
        localStorage.setItem('cards', JSON.stringify(cards));
        clearInputs();
    }

    // Function card removal
    function removeEmployee(event) {
        const cardToRemove = event.target.closest('.card');
        if (cardToRemove) {
            cardToRemove.remove();
            const cardId = cardToRemove.dataset.id;
            cards = cards.filter(card => card.id !== cardId);
            localStorage.setItem('cards', JSON.stringify(cards));
        }
    }

    // Function card editing
    function editEmployee(event) {
        const card = event.target.closest('.card');
        if (card) {
            const fullName = card.querySelector('.card__fullname').textContent;
            const [firstName, lastName] = fullName.split(' ');
            const email = card.querySelector('.card__email').textContent.split(': ')[1];
            const phone = card.querySelector('.card__cellphone').textContent.split(': ')[1];
            const position = card.querySelector('.position').textContent;
            const gender = card.querySelector('.card__gender').textContent.split(': ')[1];
    
            document.querySelector('input[name="firstName"]').value = firstName;
            document.querySelector('input[name="lastName"]').value = lastName;
            document.querySelector('input[name="email"]').value = email;
            document.querySelector('input[name="cellphone"]').value = phone;
            document.querySelector('input[name="position"]').value = position;
            document.querySelector(`input[name="gender"][value="${gender}"]`).checked = true;
    
            card.classList.add('card--editing');
        }
    }

    // Function card update
    function updateEmployee(event) {
        event.preventDefault();

        const firstName = document.querySelector('input[name="firstName"]').value;
        const lastName = document.querySelector('input[name="lastName"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const phone = document.querySelector('input[name="cellphone"]').value;
        const position = document.querySelector('input[name="position"]').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
    
        if (!firstName || !lastName || !email || !phone || !position || !gender) {
            alert("Please fill out all fields.");
            return;
        }
    
        const updatedCard = document.createElement('div');
        updatedCard.classList.add('card');
    
        updatedCard.innerHTML = `
            <div class="card__header">
                <div class="card__info">
                    <h2 class="card__fullname">${firstName} ${lastName}</h2>
                    <p class="position">${position}</p>
                </div>
            </div>
            <div class="card__contact">
                <p class="card__email">Email: ${email}</p>
                <p class="card__cellphone">Phone Number: ${phone}</p>
                <p class="card__gender">Gender: ${gender}</p>
            </div>
            <div class="displayButtons">
                <button class="editBtn">🖊️</button>
                <button class="removeBtn">❌</button>
            </div>
        `;
    
        const cardToUpdate = document.querySelector('.card--editing');
        const cardContainer = cardToUpdate.parentElement;
        cardContainer.replaceChild(updatedCard, cardToUpdate);
    
        updatedCard.classList.remove('card--editing');
        clearInputs()
   
    }

    function clearInputs() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="radio"]');
        inputs.forEach(input => {
            if (input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
     }

    document.querySelector('.clearBtn').addEventListener('click', clearInputs);
    document.querySelector('.addBtn').addEventListener('click', addEmployee);
    document.querySelector('.updateBtn').addEventListener('click', updateEmployee);

    // Remove button
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('removeBtn')) {
            removeEmployee(event);
        }
    });

    // Edit button
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('editBtn')) {
            // Clear previous editing styles
            const editingCard = document.querySelector('.card--editing');
            if (editingCard) {
                editingCard.classList.remove('card--editing');
            }

            const card = event.target.closest('.card');
            card.classList.add('card--editing');
            editEmployee(event);
        }
    });
});
