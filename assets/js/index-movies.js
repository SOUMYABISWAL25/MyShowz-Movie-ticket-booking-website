import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient();

// Load Popular Movies on homepage
async function loadPopularMovies() {
    const container = document.querySelector('.w3l-populohny-grids');

    if (!container) return;

    try {
        const { data: movies } = await client.models.Movie.list();

        // Filter for Popular Movies category
        const popularMovies = movies.filter(movie => movie.category === 'Popular Movies');

        if (popularMovies.length === 0) {
            console.log('No popular movies found');
            return;
        }

        // Clear existing static content
        container.innerHTML = '';

        // Display up to 4 popular movies
        for (const movie of popularMovies.slice(0, 4)) {
            // Get poster URL
            let posterUrl = 'assets/images/default-poster.jpg';
            if (movie.posterUrl) {
                try {
                    const urlResult = await getUrl({
                        key: movie.posterUrl
                    });
                    posterUrl = urlResult.url.toString();
                } catch (error) {
                    console.error('Error getting poster URL:', error);
                }
            }

            // Get video URL
            let videoUrl = '#';
            if (movie.s3Key) {
                try {
                    const videoResult = await getUrl({
                        key: movie.s3Key
                    });
                    videoUrl = videoResult.url.toString();
                } catch (error) {
                    console.error('Error getting video URL:', error);
                }
            }

            const movieCard = `
                <div class="item vhny-grid">
                    <div class="box16">
                        <a href="${videoUrl}" target="_blank">
                            <figure>
                                <img class="img-fluid" src="${posterUrl}" alt="${movie.title}" onerror="this.src='assets/images/default-poster.jpg'">
                            </figure>
                            <div class="box-content">
                                <h3 class="title">${movie.title}</h3>
                                <h4>
                                    <span class="post"><span class="fa fa-clock-o"></span> ${movie.category}</span>
                                    <span class="post fa fa-heart text-right"></span>
                                </h4>
                            </div>
                            <span class="fa fa-play video-icon" aria-hidden="true"></span>
                        </a>
                    </div>
                </div>
            `;

            container.innerHTML += movieCard;
        }

    } catch (error) {
        console.error('Error loading popular movies:', error);
    }
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPopularMovies);
} else {
    loadPopularMovies();
}
