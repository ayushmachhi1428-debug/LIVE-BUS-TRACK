document.addEventListener("DOMContentLoaded", () => {
    // --- 1. BUS ROUTE SEARCH FUNCTIONALITY ---
    const searchForm = document.getElementById("searchForm");
    const sourceInput = document.getElementById("source");
    const destinationInput = document.getElementById("destination");
    const searchMessage = document.getElementById("searchMessage");
    const resultsContainer = document.getElementById("results");

    // Bus routes database with integrated Google Maps directions URLs
    const busRoutes = [
        { 
            bus: "B01", 
            from: "Vaso", 
            to: "Nadiad", 
            departure: "08:00 AM", 
            status: "Scheduled",
            mapUrl: "https://www.google.com/maps/dir/Vaso,+Gujarat,+India/Nadiad,+Gujarat,+India"
        },
        { 
            bus: "B02", 
            from: "Nadiad", 
            to: "Anand", 
            departure: "09:30 AM", 
            status: "Scheduled",
            mapUrl: "https://www.google.com/maps/dir/Nadiad,+Gujarat,+India/Anand,+Gujarat,+India"
        },
        { 
            bus: "B03", 
            from: "Anand", 
            to: "Vadodara", 
            departure: "10:15 AM", 
            status: "Scheduled",
            mapUrl: "https://www.google.com/maps/dir/Anand,+Gujarat,+India/Vadodara,+Gujarat,+India"
        }
    ];

    if (searchForm && sourceInput && destinationInput && searchMessage && resultsContainer) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const source = sourceInput.value.trim().toLowerCase();
            const destination = destinationInput.value.trim().toLowerCase();

            // Filter routes matching source and destination (case-insensitive)
            const matchedBuses = busRoutes.filter(route => 
                route.from.toLowerCase().includes(source) && 
                route.to.toLowerCase().includes(destination)
            );

            // Display filtered search results
            if (matchedBuses.length > 0) {
                searchMessage.textContent = `Found ${matchedBuses.length} bus(es) for your route.`;
                resultsContainer.innerHTML = `
                    <h3 style="margin-top: 20px; color: #1e3d59;">Search Results</h3>
                    <div class="bus-container">
                        ${matchedBuses.map(route => `
                            <article class="bus-card">
                                <h3>Route ${route.bus}</h3>
                                <p>${route.from} →${route.to}</p>
                                <p>Departure: ${route.departure}</p>
                                <span class="status">${route.status}</span>
                                <br>
                                <a class="map-btn" href="${route.mapUrl}" target="_blank" rel="noopener noreferrer">
                                    View Route on Map
                                </a>
                            </article>
                        `).join("")}
                    </div>
                `;
            } else {
                searchMessage.textContent = "No direct buses found for this route.";
                resultsContainer.innerHTML = "<p style='margin-top: 15px; color: #555;'>Try searching for popular stops like 'Vaso', 'Nadiad', 'Anand', or 'Vadodara'.</p>";
            }
        });
    }

    // --- 2. LIVE GPS TRACKING FUNCTIONALITY ---
    const gpsButton = document.getElementById("gpsButton");
    const gpsStatus = document.getElementById("gpsStatus");
    const mapLink = document.getElementById("mapLink");

    if (gpsButton && gpsStatus) {
        gpsButton.addEventListener("click", () => {
            if (!navigator.geolocation) {
                gpsStatus.textContent = "Geolocation is not supported by your browser.";
                return;
            }

            gpsStatus.textContent = "Locating your position...";
            if (mapLink) {
                mapLink.hidden = true;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    gpsStatus.textContent = `Location found! Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
                    
                    if (mapLink) {
                        mapLink.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
                        mapLink.hidden = false;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            gpsStatus.textContent = "GPS permission was denied by the user.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            gpsStatus.textContent = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            gpsStatus.textContent = "The request to get user location timed out.";
                            break;
                        default:
                            gpsStatus.textContent = "An unknown error occurred while retrieving location.";
                            break;
                    }
                },
                { timeout: 10000, maximumAge: 60000 }
            );
        });
    }
});