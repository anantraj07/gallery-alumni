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
// Folders structure (add more folders as needed)
const folders = [
  {
    name: "Farewell",
    images: [
      {
        url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/889cbad2-d035-4c37-a1fb-2f9a277b8f21.png",
        alt: "Farewell ceremony for batch 2025",
        year: "2025"
      }
    ]
  },
  {
    name: "Sports Day",
    images: []
  }
];

let selectedFolderIndex = 0;

function renderFolders() {
  const folderList = document.getElementById('folderList');
  folderList.innerHTML = folders.map((folder, idx) => `
    <button 
      class="px-4 py-2 m-2 rounded ${idx === selectedFolderIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      onclick="selectFolder(${idx})"
    >${folder.name}</button>
  `).join('');
}

window.selectFolder = function(idx) {
  selectedFolderIndex = idx;
  renderFolders();
  renderGallery();
}

function renderGallery() {
  const gallery = document.getElementById('gallery');
  const images = folders[selectedFolderIndex].images;
  gallery.innerHTML = images.map((image, index) => createGalleryItem(image, index)).join('');
}

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
          <p class="text-sm text-gray-500">${image.year ? 'Class of ' + image.year : ''}</p>
        </div>
      </div>
    </div>
  `;
}

// Local upload handler
window.handleUpload = function(event) {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      folders[selectedFolderIndex].images.push({
        url: e.target.result,
        alt: file.name,
        year: new Date().getFullYear()
      });
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
}

// Google Drive Picker integration (basic, needs setup!)
// You must set up a Google Cloud API key and OAuth client, see: https://developers.google.com/picker/docs/
window.openGooglePicker = function() {
  // Replace with your API key and client ID
  const developerKey = 'YOUR_API_KEY';
  const clientId = 'YOUR_CLIENT_ID';
  const appId = 'YOUR_APP_ID';
  const scope = ['https://www.googleapis.com/auth/drive.readonly'];

  function onPickerLoaded() {
    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS_IMAGES)
      .setOAuthToken(window.gapi.auth.getToken().access_token)
      .setDeveloperKey(developerKey)
      .setCallback(function(data){
        if(data.action === google.picker.Action.PICKED){
          data.docs.forEach(doc => {
            folders[selectedFolderIndex].images.push({
              url: doc.url,
              alt: doc.name,
              year: new Date().getFullYear()
            });
          });
          renderGallery();
        }
      })
      .build();
    picker.setVisible(true);
  }

  function onAuthApiLoad() {
    window.gapi.auth.authorize(
      {
        'client_id': clientId,
        'scope': scope.join(' '),
        'immediate': false
      },
      function(authResult) {
        if (authResult && !authResult.error) {
          onPickerLoaded();
        }
      }
    );
  }

  window.gapi.load('auth', {'callback': onAuthApiLoad});
  window.gapi.load('picker');
}
// Initialize Firebase (use your own config!)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

// Modal logic
document.getElementById('openUploadModal').onclick = () => {
  document.getElementById('uploadModal').classList.remove('hidden');
};
document.getElementById('closeUploadModal').onclick = () => {
  document.getElementById('uploadModal').classList.add('hidden');
};

// Preview logic
let selectedFiles = [];
document.getElementById('uploadInput').onchange = (e) => {
  selectedFiles = Array.from(e.target.files);
  const previewArea = document.getElementById('previewArea');
  previewArea.innerHTML = '';
  selectedFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.createElement('img');
      img.src = ev.target.result;
      img.className = "h-24 rounded shadow";
      previewArea.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
};

// Confirm upload and persist
document.getElementById('confirmUpload').onclick = async () => {
  for (const file of selectedFiles) {
    const storageRef = storage.ref('images/' + Date.now() + '-' + file.name);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();
    await db.collection('gallery').add({ url, name: file.name, timestamp: Date.now() });
  }
  document.getElementById('uploadModal').classList.add('hidden');
  loadGallery();
};

// Show images from storage
async function loadGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  const snapshot = await db.collection('gallery').orderBy('timestamp', 'desc').get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const imgDiv = document.createElement('div');
    imgDiv.className = "gallery-item";
    imgDiv.innerHTML = `<img src="${data.url}" alt="${data.name}" class="h-32 rounded shadow"><p>${data.name}</p>`;
    gallery.appendChild(imgDiv);
  });
}

document.addEventListener('DOMContentLoaded', loadGallery);
// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderFolders();
  renderGallery();
});
