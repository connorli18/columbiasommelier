function discardChanges(id) {
    var r = confirm("Are you sure you want to discard changes?");
    if (r == true) {
        window.location.href = "/view/" + id;
    }
}

function get_flavors() {
    return fetch('/api/get_flavors')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

let wine;



window.onload = function() {

    document.querySelector('.add-form').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    // Retrieve the new entry ID from the session storage
    document.getElementById('name').focus();

    let newItemId = sessionStorage.getItem('newItemId');

    if (newItemId) {
        // Update the page with the new entry ID
        document.querySelector('.new-item-created').innerHTML = 
            `New item created! Click <a href="/view/${newItemId}"> here </a> to view it.`;
        // Remove the new entry ID from the session storage
        sessionStorage.removeItem('newItemId');
    }

    let container = document.querySelector('.next-line.flavortown');
    let selects = [];
    let previousValues = Array(3).fill('');
    let wine = JSON.parse(document.querySelector('.form-container').getAttribute('data-wine'));

    get_flavors().then(flavors => {
        for (let i = 0; i < 3; i++) {
            let div = document.createElement('div');
            div.className = 'enter-flavor';

            let label = document.createElement('label');
            label.htmlFor = 'flavor' + (i + 1);
            label.textContent = 'Flavor ' + (i + 1) + ':';

            let select = document.createElement('select');
            select.id = 'flavor' + (i + 1);
            select.name = 'flavor' + (i + 1);

            // Create and append the default option
            let defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select Flavor ' + (i + 1);
            select.appendChild(defaultOption);

            flavors.forEach((flavor) => {
                let option = document.createElement('option');
                option.value = flavor;
                option.text = flavor;
                select.appendChild(option);
            });

            div.appendChild(label);
            div.appendChild(select);
            container.appendChild(div);

            selects.push(select);
        }

        let wineFlavors = Object.keys(wine.flavorprofile);
        console.log('wineFlavors:', wineFlavors);
        selects.forEach((select, index) => {
            if (wineFlavors[index]) {
                select.value = wineFlavors[index];
            }
        });
        console.log('selects:', selects);

        selects.forEach((select, index) => {
            select.addEventListener('change', function() {
                let selectedOption = this.value;

                // Re-enable the previously selected option
                if (previousValues[index]) {
                    selects.forEach((otherSelect) => {
                        let otherOptions = otherSelect.options;

                        for (let i = 0; i < otherOptions.length; i++) {
                            if (otherOptions[i].value === previousValues[index]) {
                                otherOptions[i].disabled = false;
                            }
                        }
                    });
                }

                // Disable the currently selected option
                selects.forEach((otherSelect, otherIndex) => {
                    if (otherIndex !== index) {
                        let otherOptions = otherSelect.options;

                        for (let i = 0; i < otherOptions.length; i++) {
                            if (otherOptions[i].value === selectedOption) {
                                otherOptions[i].disabled = true;
                            }
                        }
                    }
                });

                // Update the previously selected option
                previousValues[index] = selectedOption;
            });
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}


document.querySelector('.add-form').addEventListener('submit', function(event) {
    // Validation
    let isValid = true;

    let textFields = ['name', 'displayname', 'winestyle', 'region', 'subregion', 'city', 'winery', 'description', 'year', 'alcohol_content', 'image'];

    // Check each text field to see if it's blank
    textFields.forEach(field => {
        let textField = document.querySelector('#' + field);
        let trimmedValue = textField.value.trim();
        textField.value = trimmedValue; // Update the value of the text field with the trimmed value
        if (trimmedValue === '') {
            console.log('Blank field: ' + field);
            isValid = false;
            textField.style.borderColor = 'red';
            textField.style.borderWidth = '3px';
        } else {
            textField.style.borderColor = 'initial';
            textField.style.borderWidth = 'medium';
        }
    });

    let dropdownFields = ['flavor1', 'flavor2', 'flavor3'];
    dropdownFields.forEach(field => {
        let dropdown = document.querySelector('#' + field);
        let selectedOption = dropdown.value;
    
        if (selectedOption === '') {
            console.log('No option selected: ' + field);
            isValid = false;
            dropdown.style.borderColor = 'red';
            dropdown.style.borderWidth = '3px';
        } else {
            dropdown.style.borderColor = '';
            dropdown.style.borderWidth = '1px';
        }
    });

    //checks year
    let yearField = document.querySelector('#year');
    let year = yearField.value.trim();
    console.log(year)
    if (year == '' || isNaN(year) || Number(year) > 2024 || !Number.isInteger(parseFloat(year)) || year.includes('.')) {
        console.log('Invalid year');
        isValid = false;
        yearField.classList.add('invalid');
    } else {
        yearField.classList.remove('invalid');
    }

    //alcohol must be less than 100
    let alcoholField = document.querySelector('#alcohol_content');
    let alcohol = parseFloat(alcoholField.value.trim());
    if (isNaN(alcohol) || alcohol >= 100 || alcohol < 0) {
        console.log('Invalid alcohol content');
        isValid = false;
        alcoholField.style.borderColor = 'red';
        alcoholField.style.borderWidth = '3px';
    } else {
        alcoholField.style.borderColor = '';
        alcoholField.style.borderWidth = '1px';
    }


    //checks that name, displayname, winery, region, subregion, city, winery are not just numbers
    let textFields2 = ['name', 'displayname', 'winery', 'region', 'subregion', 'city', 'winery'];

    textFields2.forEach(field => {
        let textField = document.querySelector('#' + field);
        let text = textField.value.trim();
        if (!isNaN(text)) {
            console.log('Invalid ' + field);
            isValid = false;
            textField.style.borderColor = 'red';
            textField.style.borderWidth = '3px';
        } else {
            textField.style.borderColor = '';
            textField.style.borderWidth = '1px';
        }
    });

    let yearField2 = document.querySelector('#year');
    let year2 = yearField.value.trim();
    if (!Number.isInteger(parseFloat(year))) {
        console.log('Invalid year');
        isValid = false;
        yearField.style.borderColor = 'red';
        yearField.style.borderWidth = '3px';
    } else {
        yearField.style.borderColor = '';
        yearField.style.borderWidth = '1px';
    }



    
    // If the form is not valid, prevent form submission
    if (!isValid) {
        console.log('Form validation failed');
        event.preventDefault();
        return;
    }

    let formData = new FormData(event.target);

    let formContainer = document.querySelector('.form-container');
    if (formContainer) {
        let wineData = formContainer.getAttribute('data-wine');
        if (wineData) {
            let wine = JSON.parse(wineData);

            // Append the id to the form data
            formData.append('id', wine.id);
        }
    }

    fetch('/edit_wine', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Store the new entry ID in the session storage
        sessionStorage.setItem('newItemId', data.id);

        // Redirect to the /add page
        window.location.href = '/edit/' + data.id;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});