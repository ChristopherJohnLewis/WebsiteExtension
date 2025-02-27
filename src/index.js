import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

 // You can copy-paste this in one chunk from firebase
const firebaseConfig = {
    apiKey: "<insert API KEY>",
    authDomain: "<domain>",
    databaseURL: "<database>",
    projectId: "<project ID>",
    storageBucket: "<bucket>",
    messagingSenderId: "<senderID>",
    appId: "<appID>",
    measurementId: "<measurementID>"
};
  
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  
  const form = document.getElementById("popup-content");
  
  loadData();
  document.getElementById('description').addEventListener('input', () => {
    saveData();
  });
  document.getElementById('rating').addEventListener('input', () => {
    saveData();
  });
  document.getElementById('type')?.addEventListener('input', () => {
    saveData();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkedTags = Array.from(document.querySelectorAll("input[name='tags']:checked"))
        .map(checkbox => checkbox.value);
    const description = document.getElementById("description").value.trim();
    const rating = document.getElementById("rating").value.trim();
    const type = document.getElementById("type").value.trim();
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (!tabs.length) {
          console.error("No active tabs found!");
          return;
      }
      const activeTab = tabs[0];
      console.log("Active tab URL:", activeTab.url);
      const messagesRef = ref(db, "media");
      push(messagesRef, {
        url: activeTab.url,
        type: type,
        description: description,
        tags: checkedTags,
        rating: rating,
        timestamp: Date.now()
      })
      .then(() => {
        console.log("Data posted successfully!");
      })
      //This should display something to the user if it fails.
      .catch((error) => {
        console.error("Firebase error:", error);
      });
    }).catch((error) => {
      console.error("Failed to get active tab:", error);
    });
    
  });
});

// Most of this data should be stored so we don't re-search the document. I'm keeping it like this since I don't see a performance issue currently and it works well enough.
// Save data to browser.storage
function saveData() {
  console.log('saving Data');
  // Get active tab URL
  browser.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      if (!tabs.length) {
        console.error("No active tabs found!");
        return;
      }

      const activeTabURL = tabs[0].url;

      // Prepare key and data for storage
      const key = `tab_${activeTabURL}`;
      const descriptionValue = document.getElementById('description').value.trim() || '';
      const ratingValue = document.getElementById('rating').value.trim() || '';
      const typeValue = document.getElementById('type').value.trim() || '';
      const checkedTags = Array.from(document.querySelectorAll("input[name='tags']:checked"))
        .map(checkbox => checkbox.value).join('/');

      const csvData = `${descriptionValue},${ratingValue},${typeValue},${checkedTags}`;

      // Save data to local storage
      browser.storage.local.set({ [key]: csvData })
        .then(() => {
          console.log('Data saved for tab:', activeTabURL);
        })
        .catch((error) => {
          console.error('Failed to save data:', error);
        });
    })
    .catch((error) => {
      console.error("Failed to get active tab:", error);
    });
}

// Load cached data for the tab
function loadData() {
  browser.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      if (!tabs.length) {
        console.error("No active tabs found!");
        return;
      }

      const tabURL = tabs[0].url;
      const key = `tab_${tabURL}`;

      browser.storage.local.get(key)
        .then((result) => {
          if (result[key]) {
            console.log("Found loadable Data:", result[key]);

            // Split CSV data and populate form fields
            const splitCSV = result[key].split(',');
            document.getElementById('description').value = splitCSV[0];
            document.getElementById('rating').value = splitCSV[1];
            document.getElementById('type').value = splitCSV[2];

            // Check checkboxes based on stored values
            const storedTags = splitCSV[3].split('/');
            document.querySelectorAll("input[name='tags']").forEach(checkbox => {
              checkbox.checked = storedTags.includes(checkbox.value);
            });
          } else {
            console.log("No loadable data found for:", key);
          }
        })
        .catch((error) => {
          console.error("Error loading data:", error);
        });
    })
    .catch((error) => {
      console.error("Failed to get active tab:", error);
    });
}