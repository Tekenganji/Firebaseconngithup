// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbRvY3PdnuX-vxe9_3Ul9dUx3oLdYj3PQ",
  authDomain: "chat-d29b3.firebaseapp.com",
  databaseURL: "https://chat-d29b3-default-rtdb.firebaseio.com",
  projectId: "chat-d29b3",
  storageBucket: "chat-d29b3.appspot.com",
  messagingSenderId: "949983208844",
  appId: "1:949983208844:web:d94eaaf98c2269d64f62a9"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const postForm = document.getElementById('postForm');
const postList = document.getElementById('postList');
let selectedPostKey = null;

function createPost() {
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;

    if (postTitle && postContent) {
        // Push post data to Firebase Database
        database.ref('posts').push({
            title: postTitle,
            content: postContent
        });

        // Clear the form fields
        postForm.reset();
    } else {
        alert('Please fill in all fields.');
    }
}

function updatePost() {
    if (selectedPostKey) {
        const postTitle = document.getElementById('postTitle').value;
        const postContent = document.getElementById('postContent').value;

        if (postTitle && postContent) {
            let updates = {
                title: postTitle,
                content: postContent
            };

            // Update post data in Firebase Database
            database.ref('posts').child(selectedPostKey).update(updates);

            // Clear the form fields
            postForm.reset();
            selectedPostKey = null;
        } else {
            alert('Please fill in all fields.');
        }
    } else {
        alert('Please select a post to update.');
    }
}

function deletePost(key) {
    if (confirm('Are you sure you want to delete this post?')) {
        // Delete post data from Firebase Database
        database.ref('posts').child(key).remove();
    }
}

// Listen for changes in the database and update the post list
database.ref('posts').on('value', (snapshot) => {
    postList.innerHTML = ''; // Clear previous posts

    snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const postItem = document.createElement('div');

        // Display post details
        postItem.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button onclick="editPost('${childSnapshot.key}')">Edit</button>
            <button onclick="deletePost('${childSnapshot.key}')">Delete</button>
        `;

        postList.appendChild(postItem);
    });
});

function editPost(key) {
    selectedPostKey = key;

    // Retrieve post details for editing
    database.ref('posts').child(key).once('value').then((snapshot) => {
        const post = snapshot.val();
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
    });
}
