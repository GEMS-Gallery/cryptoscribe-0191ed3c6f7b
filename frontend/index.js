import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const newPostBtn = document.getElementById('new-post-btn');
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts');

    // Initialize TinyMCE
    tinymce.init({
        selector: '#post-body',
        plugins: 'link image code',
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | link image | code'
    });

    newPostBtn.addEventListener('click', () => {
        postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
    });

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const author = document.getElementById('post-author').value;
        const body = tinymce.get('post-body').getContent();

        try {
            await backend.createPost(title, body, author);
            postForm.reset();
            tinymce.get('post-body').setContent('');
            postForm.style.display = 'none';
            await fetchAndDisplayPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    });

    async function fetchAndDisplayPosts() {
        try {
            const posts = await backend.getPosts();
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <div class="post-meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</div>
                    <div>${post.body}</div>
                `;
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    // Initial fetch of posts
    await fetchAndDisplayPosts();
});