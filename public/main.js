
document.addEventListener('DOMContentLoaded', () => {
  // Element references
  const newBtn = document.getElementById('newBtn');
  const editor = document.getElementById('editor');
  const sendBtn = document.getElementById('sendBtn');
  const contentInput = document.getElementById('contentInput');
  const fileInput = document.getElementById('fileInput');
  const filePreview = document.getElementById('filePreview');
  const postsDiv = document.getElementById('posts');

  // File preview handler
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) {
      filePreview.style.display = 'none';
      filePreview.innerHTML = '';
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    let previewHTML = '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      const imgURL = URL.createObjectURL(file);
      previewHTML = `<img src="${imgURL}" style="max-width: 100%; border-radius: 6px;" />`;
    } else if (['mp4', 'webm'].includes(ext)) {
      const vidURL = URL.createObjectURL(file);
      previewHTML = `<video controls style="max-width: 100%; border-radius: 6px;">
                       <source src="${vidURL}" type="video/${ext}">
                     </video>`;
    } else {
      previewHTML = `<p>📎 File attached: <strong>${file.name}</strong></p>`;
    }

    filePreview.innerHTML = previewHTML;
    filePreview.style.display = 'block';
  });

  // New post button click
  newBtn.onclick = () => {
    editor.style.display = 'block';
    contentInput.value = '';
    fileInput.value = '';
    filePreview.innerHTML = '';
    filePreview.style.display = 'none';
  };

  // Cancel post helper
  window.cancelPost = function () {
    contentInput.value = '';
    fileInput.value = '';
    filePreview.innerHTML = '';
    filePreview.style.display = 'none';
    editor.style.display = 'none';
  }

  // Submit new post
  sendBtn.onclick = async () => {
    const content = contentInput.value.trim();
    const file = fileInput.files[0];

    if (!content && !file) return;

    const formData = new FormData();
    formData.append('content', content);
    if (file) formData.append('file', file);

    await fetch('/submit', {
      method: 'POST',
      body: formData
    });

    cancelPost();
    loadPosts();
  };

  // Render file helper
  function renderFile(url) {
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return `<img src="${url}" style="max-width: 100%; border-radius: 6px;" />`;
    } else if (['mp4', 'webm'].includes(ext)) {
      return `<video controls style="max-width: 100%; border-radius: 6px;">
                <source src="${url}" type="video/${ext}">
              </video>`;
    } else {
      const filename = url.split('/').pop();
      return `<a href="${url}" download style="
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #007BFF;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.3s;
">📄 Download ${filename}</a>`;
    }
  }

  // Load all posts
  async function loadPosts() {
    const res = await fetch('/posts');
    const posts = await res.json();

    postsDiv.innerHTML = posts.reverse().map(p => {
      const content = p.content || '';
      const fileUrl = p.fileUrl || '';
      return `<div class="post-item" style="border: 1px solid #ccc; padding: 10px; border-radius: 8px;">
                ${fileUrl ? renderFile(fileUrl) : ''}
                ${content ? `<p>${content}</p>` : ''}
              </div>`;
    }).join('');
  }

  // Initial load
  loadPosts();
});