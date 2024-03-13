document.addEventListener("DOMContentLoaded", function() {

    let cards = [];
    // Carga el localStorage si es que hay.
    const cardsLS = localStorage.getItem("cards");
    if (cardsLS) {
            cards = JSON.parse(cardsLS);
            renderCards(cards);
    }

    function renderCards(cardsArray) {
        const cardContainer = document.querySelector('.card-container');
        cardContainer.innerHTML = cardsArray.map(card => card.html).join('');
    }

    function addEmployee(event) {
        event.preventDefault();
        // Genera un ID único para cada empleado.
        const id = Date.now().toString();
        
        const firstNameInput = document.querySelector('input[name="firstName"]');
        const lastNameInput = document.querySelector('input[name="lastName"]');
        const emailInput = document.querySelector('input[name="email"]');
        const phoneInput = document.querySelector('input[name="cellphone"]');
        const positionInput = document.querySelector('input[name="position"]');
        const genderInputs = document.querySelectorAll('input[name="gender"]');

        // Valores de los inputs
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
        const inputs = [firstNameInput, lastNameInput, emailInput, phoneInput, positionInput];
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (!firstName || !lastName || !email || !phone || !position || !gender) {
            return; 
        }
        // Nueva ficha de empleado
        const newCardHTML = `
            <div class="card" data-id="${id}">
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
        cards.push({ id: id, html: newCardHTML });
        localStorage.setItem('cards', JSON.stringify(cards));
        clearInputs();
    }

    // Remover ficha
    function removeEmployee(event) {
        const cardToRemove = event.target.closest('.card');
        if (cardToRemove) {
            cardToRemove.remove();
            const cardId = cardToRemove.dataset.id;
            cards = cards.filter(card => card.id !== cardId);
            localStorage.setItem('cards', JSON.stringify(cards));
        }
    }

    // Editar ficha
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

    // Actualizar ficha
    function updateEmployee(event) {
        event.preventDefault();
    
        const firstName = document.querySelector('input[name="firstName"]').value;
        const lastName = document.querySelector('input[name="lastName"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const phone = document.querySelector('input[name="cellphone"]').value;
        const position = document.querySelector('input[name="position"]').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
    
    
        // Encontrar la carta a la cuál se está modificando
        const cardId = document.querySelector('.card--editing').dataset.id;
        const cardToUpdate = document.querySelector(`.card[data-id="${cardId}"]`);
    
        if (cardToUpdate) {
            cardToUpdate.querySelector('.card__fullname').textContent = `${firstName} ${lastName}`;
            cardToUpdate.querySelector('.position').textContent = position;
            cardToUpdate.querySelector('.card__email').textContent = `Email: ${email}`;
            cardToUpdate.querySelector('.card__cellphone').textContent = `Phone Number: ${phone}`;
            cardToUpdate.querySelector('.card__gender').textContent = `Gender: ${gender}`;
    
            // Actualiza los valores en el localStorage. 
            const cardIndex = cards.findIndex(card => card.id === cardId);
            if (cardIndex !== -1) {
                cards[cardIndex].html = cardToUpdate.outerHTML;
                localStorage.setItem('cards', JSON.stringify(cards));
            }

            cardToUpdate.classList.remove('card--editing');
            clearInputs();
        }
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

    const addBtnNotification = document.querySelector('.addBtn');
     addBtnNotification.addEventListener('click', () => {
         Toastify({
             text: "New employee added successfully!",
             duration: 1500,
             gravity: "top", // Adjusted to "top" to position it at the top
             position: "right", // Adjusted to "right" to position it at the right
             stopOnFocus: true, // Prevents dismissing of toast on hover
             style: {
                 backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                 borderRadius: "10px"
             },
             offset: {
                 x: "2em",
                 y: "2em"
             }, 
         }).showToast();
     });

    const clearBtnNotification = document.querySelector('.clearBtn');
    clearBtnNotification.addEventListener('click', () => {
        Toastify({
            text: "Inputs cleared successfully!",
            duration: 1500,
            gravity: "top", // Adjusted to "top" to position it at the top
            position: "right", // Adjusted to "right" to position it at the right
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #c3c3c3, #e20000)",
                borderRadius: "10px"
            },
            offset: {
                x: "2em",
                y: "2em"
            }
        }).showToast();
    });

    const updateBtnNotification = document.querySelector('.updateBtn');
    updateBtnNotification.addEventListener('click', () => {
        Toastify({
            text: "Existing employee updated successfully!",
            duration: 1500,
            gravity: "top", // Adjusted to "top" to position it at the top
            position: "right", // Adjusted to "right" to position it at the right
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #a4a4a4, #2c8011)",
                borderRadius: "10px"
            },
            offset: {
                x: "2em",
                y: "2em"
            }, 
        }).showToast();
    });

    // Boton eliminar
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('removeBtn')) {
            removeEmployee(event);
        }
    });

    // Boton Editar
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('editBtn')) {
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
