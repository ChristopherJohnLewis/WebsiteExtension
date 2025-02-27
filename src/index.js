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
      .catch((error) => {
        console.error("Firebase error:", error);
      });
    }).catch((error) => {
      console.error("Failed to get active tab:", error);
    });
    
  });
});
