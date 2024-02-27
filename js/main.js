document.addEventListener("DOMContentLoaded", function() {
    // Function to handle form submission
    function addEmployee(event) {
        event.preventDefault();
    
        // Get form inputs
        const firstNameInput = document.querySelector('input[name="firstName"]');
        const lastNameInput = document.querySelector('input[name="lastName"]');
        const emailInput = document.querySelector('input[name="email"]');
        const phoneInput = document.querySelector('input[name="cellphone"]');
        const roleInput = document.querySelector('input[name="role"]');
        const genderInputs = document.querySelectorAll('input[name="gender"]');
    
        // Extract values from form inputs
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const role = roleInput.value;
        let gender = '';
        genderInputs.forEach(input => {
            if (input.checked) {
                gender = input.value;
            }
        });
    
        // Perform validation
        if (!firstName || !lastName || !email || !phone || !role || !gender) {
            alert("Please fill out all fields.");
            return;
        }
    
        // Create a new employee card
        const cardContainer = document.querySelector('.display__container');
        const newCard = document.createElement('div');
        newCard.classList.add('card');
    
        newCard.innerHTML = `
            <div class="card__header">
                <div class="card__info">
                    <h2 class="card__fullname">${firstName} ${lastName}</h2>
                    <p class="role">${role}</p>
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
        cardContainer.appendChild(newCard);
    }

    // Function card removal
    function removeEmployee(event) {
        const cardToRemove = event.target.closest('.card');
        if (cardToRemove) {
            cardToRemove.remove();
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
            const role = card.querySelector('.role').textContent;
            const gender = card.querySelector('.card__gender').textContent.split(': ')[1];
    
            document.querySelector('input[name="firstName"]').value = firstName;
            document.querySelector('input[name="lastName"]').value = lastName;
            document.querySelector('input[name="email"]').value = email;
            document.querySelector('input[name="cellphone"]').value = phone;
            document.querySelector('input[name="role"]').value = role;
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
        const role = document.querySelector('input[name="role"]').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
    
        // Perform validation
        if (!firstName || !lastName || !email || !phone || !role || !gender) {
            alert("Please fill out all fields.");
            return;
        }
    
        // Create a new employee card with updated information
        const updatedCard = document.createElement('div');
        updatedCard.classList.add('card');
    
        updatedCard.innerHTML = `
            <div class="card__header">
                <div class="card__info">
                    <h2 class="card__fullname">${firstName} ${lastName}</h2>
                    <p class="role">${role}</p>
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

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('removeBtn')) {
            removeEmployee(event);
        }
    });

    // Event delegation for the "Edit" button
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
