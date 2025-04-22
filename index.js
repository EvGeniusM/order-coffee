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
        beverages.forEach((beverage) => {
            let deleteBtn = beverage.querySelector('.delete-btn') || createDeleteButton(beverage);
            deleteBtn.disabled = beverages.length <= 1;
        });
    }

    function updateRadioNames() {
        document.querySelectorAll('.beverage').forEach((beverage, index) => {
            const milkRadios = beverage.querySelectorAll('input[type="radio"]');
            milkRadios.forEach(radio => {
                radio.name = 'milk-' + index;
            });
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
        updateRadioNames();
    });

    form.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const beverage = e.target.closest('.beverage');
            if (beverage && document.querySelectorAll('.beverage').length > 1) {
                beverage.remove();
                updateDeleteButtons();
                updateRadioNames();
            }
        }
    });

    document.querySelector('.submit-button').addEventListener('click', function(e) {
        e.preventDefault();

        function getDrinkWord(count) {
            const lastDigit = count % 10;
            const lastTwoDigits = count % 100;

            if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
                return 'напитков';
            }
            if (lastDigit === 1) {
                return 'напиток';
            }
            if (lastDigit >= 2 && lastDigit <= 4) {
                return 'напитка';
            }
            return 'напитков';
        }

        const beverages = document.querySelectorAll('.beverage');
        const drinkCount = beverages.length;
        const drinkWord = getDrinkWord(drinkCount);

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'modal';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';

        const modalText = document.createElement('p');
        modalText.textContent = `Вы заказали ${drinkCount} ${drinkWord}`;

        const table = document.createElement('table');
        table.className = 'order-table';

        const headerRow = document.createElement('tr');
        ['Напиток', 'Молоко', 'Дополнительно'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        beverages.forEach(beverage => {
            const row = document.createElement('tr');

            const select = beverage.querySelector('select');
            const drinkName = select.options[select.selectedIndex].textContent;
            const drinkCell = document.createElement('td');
            drinkCell.textContent = drinkName;
            row.appendChild(drinkCell);

            const checkedMilk = beverage.querySelector('input[type="radio"]:checked');
            let milkText = '';
            if (checkedMilk) {
                const milkLabel = checkedMilk.closest('label');
                if (milkLabel) {
                    milkText = milkLabel.textContent.trim();
                    if(milkText.includes('обычном')) {
                        milkText = 'обычное';
                    }
                }
            }
            const milkCell = document.createElement('td');
            milkCell.textContent = milkText;
            row.appendChild(milkCell);

            const checkedOptions = beverage.querySelectorAll('input[type="checkbox"]:checked');
            const extraArr = [];
            checkedOptions.forEach(cb => {
                const cbLabel = cb.closest('label');
                if (cbLabel) {
                    extraArr.push(cbLabel.textContent.trim());
                }
            });
            const extraCell = document.createElement('td');
            extraCell.textContent = extraArr.join(', ');
            row.appendChild(extraCell);

            table.appendChild(row);
        });

        modal.appendChild(closeBtn);
        modal.appendChild(modalText);
        modal.appendChild(table);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    });

    updateDeleteButtons();
    updateRadioNames();
});