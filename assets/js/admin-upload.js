import { Amplify } from 'aws-amplify';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient();
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');

// File input listeners
const posterInput = document.getElementById('posterImage');
const movieInput = document.getElementById('movieFile');

if (posterInput) {
    posterInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const feedback = document.getElementById('posterFeedback');
        console.log('Poster file selected:', file);
        if (file) {
            const sizeKB = (file.size / 1024).toFixed(2);
            feedback.textContent = `✓ Selected: ${file.name} (${sizeKB} KB)`;
            feedback.style.color = '#4CAF50';
        } else {
            feedback.textContent = '';
        }
    });
}

if (movieInput) {
    movieInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const feedback = document.getElementById('fileFeedback');
        console.log('Movie file selected:', file);
        if (file) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            feedback.textContent = `✓ Selected: ${file.name} (${sizeMB} MB)`;
            feedback.style.color = '#4CAF50';
        } else {
            feedback.textContent = '';
        }
    });
}


uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const posterImage = document.getElementById('posterImage').files[0];
    const file = document.getElementById('movieFile').files[0];

    if (!category) {
        uploadStatus.innerText = 'Please select a category.';
        uploadStatus.style.color = 'red';
        return;
    }

    if (!file) {
        uploadStatus.innerText = 'Please select a movie file.';
        uploadStatus.style.color = 'red';
        return;
    }

    if (!posterImage) {
        uploadStatus.innerText = 'Please select a poster image.';
        uploadStatus.style.color = 'red';
        return;
    }

    console.log(`File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    uploadStatus.innerText = 'Starting upload...';
    uploadStatus.style.color = 'blue';

    try {
        // Upload poster image first
        uploadStatus.innerText = 'Uploading poster image...';
        const posterKey = `movies/posters/${Date.now()}-${posterImage.name}`;

        const posterUpload = uploadData({
            key: posterKey,
            data: posterImage,
            options: {
                onProgress: ({ transferredBytes, totalBytes }) => {
                    if (totalBytes) {
                        const percentage = Math.round((transferredBytes / totalBytes) * 100);
                        uploadStatus.innerText = `Uploading poster: ${percentage}%`;
                    }
                }
            }
        });

        await posterUpload.result;
        console.log('Poster uploaded successfully:', posterKey);

        // Upload movie file
        uploadStatus.innerText = 'Uploading movie file... This may take a while for large files.';
        const s3Key = `movies/${Date.now()}-${file.name}`;

        const movieUpload = uploadData({
            key: s3Key,
            data: file,
            options: {
                onProgress: ({ transferredBytes, totalBytes }) => {
                    if (totalBytes) {
                        const percentage = Math.round((transferredBytes / totalBytes) * 100);
                        const mbTransferred = (transferredBytes / (1024 * 1024)).toFixed(2);
                        const mbTotal = (totalBytes / (1024 * 1024)).toFixed(2);
                        uploadStatus.innerText = `Uploading movie: ${percentage}% (${mbTransferred}MB / ${mbTotal}MB)`;
                    }
                }
            }
        });

        await movieUpload.result;
        console.log('Movie uploaded successfully:', s3Key);

        // Save to database
        uploadStatus.innerText = 'Saving to database...';
        await client.models.Movie.create({
            title: title,
            description: description,
            category: category,
            s3Key: s3Key,
            posterUrl: posterKey
        });

        uploadStatus.innerText = '✅ Upload Successful! Movie and poster uploaded.';
        uploadStatus.style.color = 'green';
        uploadForm.reset();

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'admin_dashboard.html';
        }, 2000);

    } catch (error) {
        console.error('Error uploading movie:', error);
        uploadStatus.innerText = `❌ Upload Failed: ${error.message}. Please check console for details.`;
        uploadStatus.style.color = 'red';

        // Log detailed error
        console.error('Full error details:', {
            error,
            message: error.message,
            stack: error.stack
        });
    }
});
