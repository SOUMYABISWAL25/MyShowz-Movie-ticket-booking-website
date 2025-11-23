import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient();
const moviesList = document.getElementById('moviesList');

async function fetchMovies() {
    try {
        const { data: movies } = await client.models.Movie.list();

        if (movies.length === 0) {
            moviesList.innerHTML = '<div class="text-center" style="width: 100%;">No movies available.</div>';
            return;
        }

        moviesList.innerHTML = '';

        for (const movie of movies) {
            // Generate signed URL for download
            const linkResult = await getUrl({
                key: movie.s3Key,
                options: {
                    accessLevel: 'guest',
                    validateObjectExistence: false
                }
            });

            // Get poster image URL if available
            let posterImageUrl = `assets/images/banner${Math.floor(Math.random() * 4) + 1}.jpg`; // Default
            if (movie.posterUrl) {
                try {
                    const posterResult = await getUrl({
                        key: movie.posterUrl,
                        options: {
                            accessLevel: 'guest',
                            validateObjectExistence: false
                        }
                    });
                    posterImageUrl = posterResult.url;
                } catch (err) {
                    console.warn('Could not load poster:', err);
                }
            }

            const movieCard = document.createElement('div');
            movieCard.className = 'item vhny-grid';
            movieCard.innerHTML = `
                <div class="box16 mb-0">
                    <figure>
                        <img class="img-fluid" src="${posterImageUrl}" alt="${movie.title}" style="object-fit: cover; height: 300px;">
                    </figure>
                    <div class="box-content">
                        <h3 class="title">${movie.title}</h3>
                        <p style="font-size: 0.9rem; color: #999;">${movie.description}</p>
                        <div class="mt-3">
                            <a href="${linkResult.url}" class="btn btn-primary btn-sm" target="_blank" style="margin-right: 10px;">
                                <span class="fa fa-play"></span> Watch
                            </a>
                            <a href="${linkResult.url}" class="btn btn-secondary btn-sm" download>
                                <span class="fa fa-download"></span> Download
                            </a>
                        </div>
                    </div>
                </div>
            `;
            moviesList.appendChild(movieCard);
        }

    } catch (error) {
        console.error('Error fetching movies:', error);
        moviesList.innerHTML = `<div class="text-center text-danger" style="width: 100%;">Error loading movies: ${error.message}</div>`;
    }
}

fetchMovies();
