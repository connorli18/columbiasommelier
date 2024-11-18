document.addEventListener('DOMContentLoaded', function() {
    // Define a function to fetch the data

    function renderLoading() {
        let resultsContainer = document.querySelector('.results-container');
        if (resultsContainer) {  // Check that resultsContainer is not null
            resultsContainer.innerHTML = '';  // Replace with your loading message or spinner
        }
    }

    function highlightMatch(title, query) {
        const index = title.toLowerCase().indexOf(query.toLowerCase());
        if (index !== -1) {
            return `${title.slice(0, index)}<span class="highlight">${title.slice(index, index + query.length)}</span>${title.slice(index + query.length)}`;
        }
        return title;
    }


    function fetchData(term) {

        var searchTermElement = document.querySelector('#searchTerm');
        if (searchTermElement) {  // Check that searchTermElement is not null
            searchTermElement.textContent = 'Search results for "' + term + '"';
        }

        fetch('/api/search-wine?term=' + encodeURIComponent(term))
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(results => {
                console.log('Results:', results);
                renderData(results);  // Call the renderData function with the results
            })
            .catch(error => console.error('Error:', error));
    }

    // Define a function to render the data
    function renderData(results) {
        let resultsContainer = document.querySelector('.results-container');
        let resultsCount = document.querySelector('.results-count');
        let noResults = document.querySelector('.no-results');

        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }

        if (!results || results.length === 0) {
            if (noResults) {
                noResults.style.display = 'block';
            }
            if (resultsCount) {
                resultsCount.style.display = 'none';
            }
        } else {
            if (noResults) {
                noResults.style.display = 'none';
            }
            if (resultsCount) {
                resultsCount.style.display = 'block';
                resultsCount.textContent = `${results.length} result(s) found`;
            }

            results.forEach(result => {
                let searchResult = document.createElement('div');
                searchResult.className = 'search-result col-4';

                searchResult.addEventListener('click', () => {
                    window.location.href = '/view/' + result['item']['id'];
                });

                let imagePadder = document.createElement('div');
                imagePadder.className = 'image-padder col-4';

                let wineImage = document.createElement('img');
                wineImage.src = result['item']['image'];
                wineImage.alt = 'Wine image';
                wineImage.className = 'wine-image-search';

                imagePadder.appendChild(wineImage);

                let nameAndMatch = document.createElement('div');
                nameAndMatch.className = 'name-and-match col-8';

                let searchName = document.createElement('div');
                searchName.className = 'search-name';
                searchName.textContent = result['item']['name'];

                const title = highlightMatch(result['item']['name'], term);
                searchName.innerHTML = title;

                let searchMatches = document.createElement('div');
                searchMatches.className = 'search-matches';

                for (let key in result['context']) {
                    let match = document.createElement('div');
                    match.className = 'match';

                    // Get the context and the search term
                    let context = result['context'][key];
                    let term = urlParams.get('term');

                    // Create a new regular expression from the search term
                    let regex = new RegExp(`(${term})`, 'gi');

                    // Replace all occurrences of the search term in the context with the search term wrapped in <strong> and <u> tags
                    let highlightedContext = context.replace(regex, '<strong style="font-size: 1.1em; font-style: italic;">$1</strong>');
                    // Set the innerHTML of the match element to the highlighted context
                    match.innerHTML = `• ${key}: ...${highlightedContext}...`;

                    searchMatches.appendChild(match);
                }

                nameAndMatch.appendChild(searchName);
                nameAndMatch.appendChild(searchMatches);

                searchResult.appendChild(imagePadder);
                searchResult.appendChild(nameAndMatch);

                if (resultsContainer) {
                    resultsContainer.appendChild(searchResult);
                }
            });
        }
    }
    // Attach an event listener to the search form
    document.querySelector('#searchForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the form from being submitted normally

        // Get the search term from the form
        var term = document.querySelector('#searchInput').value;

        // If the term is empty or just whitespace, reset the input field and return
        if (!term.trim()) {
            document.querySelector('#searchInput').value = '';
            document.querySelector('#searchInput').focus();
            return;
        }

        window.location.href = '/search?term=' + encodeURIComponent(term);
    });

    var urlParams = new URLSearchParams(window.location.search);
    var term = urlParams.get('term');
    if (term) {
        renderLoading();
        fetchData(term);
    }
});