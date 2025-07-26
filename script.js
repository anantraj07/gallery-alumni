// Sample alumni images (in a real app, these would come from an API/database)
const alumniImages = [
    {
        url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/889cbad2-d035-4c37-a1fb-2f9a277b8f21.png",
        alt: "Farewell ceremony for batch 2025 with emotional goodbyes",
        year: "2025"
    },
    // Rest of your image array...
];

// Function to create a gallery item
function createGalleryItem(image, index) {
    const delay = (index % 8) * 0.1;
    return `
        <div class="gallery-item" style="animation-delay: ${delay}s">
            <div class="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div class="relative pt-[75%] overflow-hidden">
                    <img 
                        src="${image.url}" 
                        alt="${image.alt}"
                        class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                </div>
                <div class="p-4 flex-grow">
                    <p class="text-sm text-gray-500">Class of ${image.year}</p>
                </div>
            </div>
        </div>
    `;
}

// Function to create a collage item (different styling)
function createCollageItem(image, index) {
    const rotations = ['rotate-2', '-rotate-1', 'rotate-3', '-rotate-2'];
    return `
        <div class="collage-item transform ${rotations[index % rotations.length]} hover:scale-105 transition-all duration-300">
            <img 
                src="${image.url}" 
                alt="${image.alt}"
                class="w-full h-full object-cover rounded-lg shadow-lg border-4 border-white"
            />
        </div>
    `;
}

// Function to render the gallery
function renderGallery() {
    const gallery = document.getElementById('gallery');
    const collage = document.getElementById('collage');
    
    // Clear previous items
    gallery.innerHTML = '';
    collage.innerHTML = '';
    
    // Shuffle array
    const shuffled = [...alumniImages].sort(() => 0.5 - Math.random());
    
    // Take 8 for main gallery
    shuffled.slice(0, 8).forEach((image, index) => {
        gallery.innerHTML += createGalleryItem(image, index);
    });
    
    // Take 4 for collage
    shuffled.slice(0, 4).forEach((image, index) => {
        collage.innerHTML += createCollageItem(image, index);
    });
}

// Initial render
renderGallery();

// Auto refresh every 30 seconds
const refreshInterval = setInterval(renderGallery, 30000);

// Shuffle button functionality
document.getElementById('shuffleBtn').addEventListener('click', () => {
    renderGallery();
    
    // Reset the auto-refresh timer
    clearInterval(refreshInterval);
    setInterval(renderGallery, 30000);
});

// Show loading effect on initial load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingElements = document.querySelectorAll('.gallery-item, .collage-item');
        loadingElements.forEach(el => {
            el.style.opacity = '1';
        });
    }, 100);
});
