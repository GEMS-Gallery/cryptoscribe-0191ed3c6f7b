import { backend } from 'declarations/backend';

let editor;

document.addEventListener('DOMContentLoaded', async () => {
    const newPostBtn = document.getElementById('new-post-btn');
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts');

    // Initialize Monaco Editor
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: '',
            language: 'markdown',
            theme: 'vs-light'
        });
    });

    newPostBtn.addEventListener('click', () => {
        postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
    });

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const author = document.getElementById('post-author').value;
        const body = editor.getValue();

        try {
            await backend.createPost(title, body, author);
            postForm.reset();
            editor.setValue('');
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
                    <div>${renderMarkdown(post.body)}</div>
                `;
                postsContainer.appendChild(postElement);
            });
            hljs.highlightAll();
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    function renderMarkdown(markdown) {
        // This is a simple markdown renderer. For a full markdown parser, consider using a library like marked.js
        const codeBlockRegex = new RegExp(`\`\`\`(\\w+)?\\n([\\s\\S]*?)\`\`\``, 'g');
        return markdown.replace(codeBlockRegex, (match, language, code) => {
            return `<pre><code class="language-${language || ''}">${code.trim()}</code></pre>`;
        });
    }

    // Initial fetch of posts
    await fetchAndDisplayPosts();
});