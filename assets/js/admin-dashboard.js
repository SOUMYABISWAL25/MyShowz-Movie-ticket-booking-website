import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import { remove } from 'aws-amplify/storage';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient();

// Fetch and display statistics
async function loadStatistics() {
    try {
        const [moviesData, todosData] = await Promise.all([
            client.models.Movie.list(),
            client.models.Todo.list()
        ]);

        document.getElementById('totalMovies').textContent = moviesData.data.length;
        document.getElementById('totalTodos').textContent = todosData.data.length;
        document.getElementById('totalUsers').textContent = '-'; // No user model yet
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Fetch and display movies
async function loadMovies() {
    const container = document.getElementById('moviesTableContainer');

    try {
        const { data: movies } = await client.models.Movie.list();

        if (movies.length === 0) {
            container.innerHTML = '<p class="text-center">No movies uploaded yet.</p>';
            return;
        }

        let tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>S3 Key</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const movie of movies) {
            const createdAt = movie.createdAt ? new Date(movie.createdAt).toLocaleString() : 'N/A';
            const category = movie.category || 'N/A';
            tableHTML += `
                <tr>
                    <td>${movie.id.substring(0, 8)}...</td>
                    <td><strong>${movie.title}</strong></td>
                    <td><span style="background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${category}</span></td>
                    <td>${movie.description}</td>
                    <td style="font-size: 11px; color: #666;">${movie.s3Key}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewMovie('${movie.s3Key}')">
                            <span class="fa fa-eye"></span> View
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteMovie('${movie.id}', '${movie.s3Key}')">
                            <span class="fa fa-trash"></span> Delete
                        </button>
                    </td>
                </tr>
            `;
        }

        tableHTML += `
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error loading movies:', error);
        container.innerHTML = `<div class="error">Error loading movies: ${error.message}</div>`;
    }
}

// Fetch and display todos
async function loadTodos() {
    const container = document.getElementById('todosTableContainer');

    try {
        const { data: todos } = await client.models.Todo.list();

        if (todos.length === 0) {
            container.innerHTML = '<p class="text-center">No todos found.</p>';
            return;
        }

        let tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Content</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const todo of todos) {
            const createdAt = todo.createdAt ? new Date(todo.createdAt).toLocaleString() : 'N/A';
            tableHTML += `
                <tr>
                    <td>${todo.id.substring(0, 8)}...</td>
                    <td>${todo.content}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="action-btn btn-delete" onclick="deleteTodo('${todo.id}')">
                            <span class="fa fa-trash"></span> Delete
                        </button>
                    </td>
                </tr>
            `;
        }

        tableHTML += `
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error loading todos:', error);
        container.innerHTML = `<div class="error">Error loading todos: ${error.message}</div>`;
    }
}

// View movie
window.viewMovie = async function (s3Key) {
    try {
        const linkResult = await getUrl({
            key: s3Key,
            options: {
                accessLevel: 'guest',
                validateObjectExistence: false
            }
        });
        window.open(linkResult.url, '_blank');
    } catch (error) {
        alert('Error viewing movie: ' + error.message);
    }
};

// Delete movie
window.deleteMovie = async function (movieId, s3Key) {
    if (!confirm('Are you sure you want to delete this movie? This will also remove the file from storage.')) {
        return;
    }

    try {
        // Delete from database
        await client.models.Movie.delete({ id: movieId });

        // Delete from S3
        try {
            await remove({
                key: s3Key,
                options: {
                    accessLevel: 'guest'
                }
            });
        } catch (storageError) {
            console.warn('Error deleting from storage:', storageError);
        }

        alert('Movie deleted successfully!');
        loadMovies();
        loadStatistics();
    } catch (error) {
        alert('Error deleting movie: ' + error.message);
    }
};

// Delete todo
window.deleteTodo = async function (todoId) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }

    try {
        await client.models.Todo.delete({ id: todoId });
        alert('Todo deleted successfully!');
        loadTodos();
        loadStatistics();
    } catch (error) {
        alert('Error deleting todo: ' + error.message);
    }
};

// Initialize dashboard
loadStatistics();
loadMovies();
loadTodos();
