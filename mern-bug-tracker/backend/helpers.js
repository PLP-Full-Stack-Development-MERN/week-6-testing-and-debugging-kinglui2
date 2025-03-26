function validateBugInput(title, description) {
    if (!title || !description) {
        return { valid: false, error: 'Title and description are required.' };
    }
    if (title.length < 5) {
        return { valid: false, error: 'Title must be at least 5 characters long.' };
    }
    if (description.length < 10) {
        return { valid: false, error: 'Description must be at least 10 characters long.' };
    }
    return { valid: true };
}

module.exports = { validateBugInput };
