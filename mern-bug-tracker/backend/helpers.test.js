const { validateBugInput } = require('./helpers');

describe('validateBugInput', () => {
    it('should return invalid for title shorter than 5 characters', () => {
        const result = validateBugInput('Test', 'This is a test bug description.');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Title must be at least 5 characters long.');
    });

    it('should return invalid for description shorter than 10 characters', () => {
        const result = validateBugInput('Test Bug', 'Short');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Description must be at least 10 characters long.');
    });
    it('should return valid for correct inputs', () => {
        const result = validateBugInput('Test Bug', 'This is a test bug description.');
        expect(result.valid).toBe(true);
    });

    it('should return invalid for missing title', () => {
        const result = validateBugInput('', 'This is a test bug description.');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Title and description are required.');
    });

    it('should return invalid for missing description', () => {
        const result = validateBugInput('Test Bug', '');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Title and description are required.');
    });

    it('should return invalid for both fields missing', () => {
        const result = validateBugInput('', '');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Title and description are required.');
    });
});
