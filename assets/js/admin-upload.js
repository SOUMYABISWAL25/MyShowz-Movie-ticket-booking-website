import { Amplify } from 'aws-amplify';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient();
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const posterImage = document.getElementById('posterImage').files[0];
    const file = document.getElementById('movieFile').files[0];

    if (!file) {
        alert('Please select a movie file.');
        return;
    }

    if (!posterImage) {
        alert('Please select a poster image.');
        return;
    }

    uploadStatus.innerText = 'Uploading...';
    uploadStatus.style.color = 'blue';

    try {
        // Upload poster image first
        const posterKey = `movies/posters/${Date.now()}-${posterImage.name}`;
        await uploadData({
            key: posterKey,
            data: posterImage,
            options: {
                accessLevel: 'guest',
            }
        }).result;

        // Upload movie file
        const s3Key = `movies/${Date.now()}-${file.name}`;
        await uploadData({
            key: s3Key,
            data: file,
            options: {
                accessLevel: 'guest',
            }
        }).result;

        // Save to database with poster URL
        await client.models.Movie.create({
            title: title,
            description: description,
            s3Key: s3Key,
            posterUrl: posterKey
        });

        uploadStatus.innerText = 'Upload Successful!';
        uploadStatus.style.color = 'green';
        uploadForm.reset();
    } catch (error) {
        console.error('Error uploading movie:', error);
        uploadStatus.innerText = 'Upload Failed: ' + error.message;
        uploadStatus.style.color = 'red';
    }
});
