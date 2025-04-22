document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const addButton = document.querySelector('.add-button');

    function createDeleteButton(beverage) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.type = 'button';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '5px';
        deleteBtn.style.right = '10px';
        deleteBtn.style.background = 'none';
        deleteBtn.style.border = 'none';
        deleteBtn.style.fontSize = '20px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.color = '#999';
        
        deleteBtn.addEventListener('mouseover', () => {
            deleteBtn.style.color = '#f00';
        });
        
        deleteBtn.addEventListener('mouseout', () => {
            deleteBtn.style.color = '#999';
        });
        
        beverage.style.position = 'relative';
        beverage.prepend(deleteBtn);
        return deleteBtn;
    }

    function updateDeleteButtons() {
        const beverages = document.querySelectorAll('.beverage');
        beverages.forEach((beverage, index) => {
            let deleteBtn = beverage.querySelector('.delete-btn') || createDeleteButton(beverage);
            deleteBtn.disabled = beverages.length <= 1;
        });
    }

    addButton.addEventListener('click', function() {
        const lastBeverage = document.querySelector('.beverage:last-of-type');
        const newBeverage = lastBeverage.cloneNode(true);
        const beverageCount = document.querySelectorAll('.beverage').length + 1;
        newBeverage.querySelector('.beverage-count').textContent = `Напиток №${beverageCount}`;

        const selects = newBeverage.querySelectorAll('select');
        selects.forEach(select => select.selectedIndex = 1);

        const radios = newBeverage.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.checked = radio.value === 'usual');

        const checkboxes = newBeverage.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);

        addButton.parentElement.before(newBeverage);
        updateDeleteButtons();
    });

    form.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const beverage = e.target.closest('.beverage');
            if (beverage && document.querySelectorAll('.beverage').length > 1) {
                beverage.remove();
                updateDeleteButtons();
            }
        }
    });

    updateDeleteButtons();
});