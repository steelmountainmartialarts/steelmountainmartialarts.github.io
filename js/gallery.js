// gallery.js

// Your live Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyJQyLoIIrImfEfwuZkIcZCRrOGlxHQhrWxFNm7n5XkJh9jFGSa671_E-lX7If35l6F/exec';

async function loadSecureDriveGallery() {
    const container = document.getElementById('gallery-container');
    
    try {
        const response = await fetch(WEB_APP_URL);
        if (!response.ok) throw new Error('Failed to reach Google web app');
        
        const galleryData = await response.json();
        
        // Sort years in descending order (2026, 2025, 2024...)
        const sortedYears = Object.keys(galleryData).sort((a, b) => b - a);

        if (sortedYears.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: white;">The gallery is currently empty.</p>';
            return;
        }

        // Clear out the loading text
        container.innerHTML = '';

        // Build the layout matching your exact CSS styling hooks
        sortedYears.forEach(year => {
            const mediaItems = galleryData[year];
            if (mediaItems.length === 0) return; // Skip empty years

            // Create Section Title for the Year
            const titleElement = document.createElement('h1');
            titleElement.className = 'galTitle';
            titleElement.textContent = year;
            container.appendChild(titleElement);
            container.appendChild(document.createElement('br'));

            // Create the grid layout container
            const galleryGrid = document.createElement('div');
            galleryGrid.className = 'gallery';
            container.appendChild(galleryGrid);

            // Spacing elements matching original design layout
            const spacer = document.createElement('br');
            container.appendChild(spacer);
            container.appendChild(spacer.cloneNode());

            // Loop through the media items for this year
            mediaItems.forEach(file => {
                if (file.type === 'video') {
                    // Create an iframe to use Google's native streaming video player
                    const iframeNode = document.createElement('iframe');
                    
                    // Direct link to Google's video preview layout
                    iframeNode.src = `https://drive.google.com/file/d/${file.id}/preview`;
                    
                    // Clean presentation styles so it matches your photo grids nicely
                    iframeNode.style.width = "100%";
                    iframeNode.style.height = "100%";
                    iframeNode.style.border = "none";
                    iframeNode.allow = "autoplay";
                    iframeNode.loading = "lazy";
                    
                    galleryGrid.appendChild(iframeNode);
                } else {
                    const imgNode = document.createElement('img');
                    imgNode.src = `https://lh3.googleusercontent.com/d/${file.id}`;
                    imgNode.alt = `Steel Mountain Martial Arts - ${year}`;
                    galleryGrid.appendChild(imgNode);
                }
            });
        });

    } catch (error) {
        console.error('Error rendering dynamic gallery:', error);
        container.innerHTML = '<p style="text-align: center; color: red;">Failed to sync with gallery folders. Please refresh or try again later.</p>';
    }
}

// Fire up the script when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSecureDriveGallery);