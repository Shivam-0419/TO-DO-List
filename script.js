const API_URL = `${window.location.origin}/api`;

async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a task');
        return;
    }

    try {
        // Send task to backend
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                userId: localStorage.getItem('userId') || null // Use null if not signed in
            })
        });

        if (response.ok) {
            const task = await response.json();
            // Redirect to the new page with the task ID
            window.location.href = `task-view.html?id=${task._id}`;
        } else {
            alert('Failed to add task');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error connecting to server');
    }
}
