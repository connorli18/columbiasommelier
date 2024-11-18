document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired'); // Debugging line

    var contentElement = document.getElementById('content');
    console.log('content element:', contentElement); // Debugging line

    if (contentElement) {
        contentElement.innerHTML = `
            <div class="container-fluid">
                <div class="row container-design">
                    <div class="col-12">
                        <h1 class="text-center display-1 typing-text-style" id="typing-text"></h1>
                    </div>
                </div>
                <div class="row-wine">
                    <div class="col-md-4 wine-display">
                        <a id="red-wine-link">
                            <div class="card text-center">
                                <div class="card-header">
                                    Red Wine of the Day
                                </div>
                                <img src="static/images/redwine.png" class="card-img-top" alt="Red Wine Clipart">
                                <div class="card-body" id="red-wine-name"></div>
                            </div>
                        </a>
                    </div>
                    <div class="col-md-4 wine-display">
                        <a id="white-wine-link">
                            <div class="card text-center">
                                <div class="card-header">
                                    White Wine of the Day
                                </div>
                                <img src="static/images/whitewine.png" class="card-img-top" alt="White Wine Clipart">
                                <div class="card-body" id="white-wine-name"></div>
                            </div>
                        </a>
                    </div>
                    <div class="col-md-4 wine-display">
                        <a id="speciality-wine-link">
                            <div class="card text-center">
                                <div class="card-header">
                                    Speciality Wine of the Day
                                </div>
                                <img src="static/images/orangewine.png" class="card-img-top" alt="Speciality Wine Clipart">
                                <div class="card-body" id="speciality-wine-name"></div>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="row-wine">
                    <div class="col-12 slogan">
                        "Sip, Savor, Celebrate! This is Columbia's Gateway to the Wine World for Enthusiasts of Every Level. Viva La Vino!"
                    </div>
                </div>
            </div>
            
        `;

        let index = 0;
        const text = 'Making Wine Easy...';

        function type() {
            if (index < text.length) {
                document.getElementById('typing-text').innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 100); // Continue typing after a short delay
            } else {
                // Delay the reset and clearing of the text
                setTimeout(function() {
                    index = 0;
                    document.getElementById('typing-text').innerHTML = '';
                    type(); // Start typing again
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        }

        // Start the typing effect
        type();

        // Fetch wine data from the server
        fetch('api/display-wines')
        .then(response => response.json())
        .then(data => {
            // Display the wine data in the corresponding elements
            document.getElementById('red-wine-name').innerHTML = `<h5 class="card-title">${data.redWine.name} ${data.redWine.year}</h5>`;
            document.getElementById('red-wine-link').href = `/view/${data.redWine.id}`;

            document.getElementById('white-wine-name').innerHTML = `<h5 class="card-title">${data.whiteWine.name} ${data.whiteWine.year}</h5>`;
            document.getElementById('white-wine-link').href = `/view/${data.whiteWine.id}`;

            document.getElementById('speciality-wine-name').innerHTML = `<h5 class="card-title">${data.specialityWine.name} ${data.specialityWine.year}</h5>`;
            document.getElementById('speciality-wine-link').href = `/view/${data.specialityWine.id}`;
        })
        .catch(error => console.error('Error:', error));

    }
});