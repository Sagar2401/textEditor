/* eslint-disable testing-library/no-wait-for-multiple-assertions */
// Import necessary testing utilities
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

// Mock window.alert before tests
import App from './App';
jest.spyOn(window, 'alert').mockImplementation(() => {});


// After all tests, restore the original implementation of window.alert
afterAll(() => {
  jest.restoreAllMocks();
});

describe('App Component', () => {
  test('renders App component', () => {
    render(<App />);
    // Add your assertion for rendering here if needed
  });

  test('selects font family', () => {
    render(<App />);
    // Add your test for selecting font family here
  });

  test('updates font weights when font family changes', () => {
    render(<App />);
    // Add your test for updating font weights here
  });

  test('saves and loads text from local storage', async () => {
    render(<App />);

    // Change the value in the textarea and click the "Save" button
    fireEvent.change(screen.getByPlaceholderText('Enter message'), {
      target: { value: 'Hello, world!' },
    });
    fireEvent.click(screen.getByText('Save'));

    // Reload the component to simulate a new session
    render(<App />);

    // Wait for the component to load saved text
    await waitFor(() => {
      // Assert against the mock function
      expect(window.alert).toHaveBeenCalledWith('Text saved successfully!');
    });
    expect(screen.getByPlaceholderText('Enter message')).toHaveValue('Hello, world!');
  });

  test('saves font settings to local storage', async () => {
    render(<App />);

    // Change font family and weight, and check the italic checkbox
    fireEvent.change(screen.getByLabelText(/Font Family/), {
      target: { value: 'Roboto' },
    });
    fireEvent.change(screen.getByLabelText(/Font Weight:/), {
      target: { value: '400' },
    });
    fireEvent.click(screen.getByLabelText(/Italic:/));

    // Click the "Save Font Settings" button
    fireEvent.click(screen.getByText('Save Font Settings'));

    // Reload the component to simulate a new session
    render(<App />);

    // Wait for the component to load saved font settings
    await waitFor(() => {
      // Assert against the mock function
      expect(window.alert).toHaveBeenCalledWith('Font settings saved successfully!');
      // Add your assertions for checking saved font settings here
    });
  });

  test('resets all settings and clears local storage', async () => {
    render(<App />);

    // Change font family, weight, and check the italic checkbox
    fireEvent.change(screen.getByLabelText(/Font Family/), {
      target: { value: 'Roboto' },
    });
    fireEvent.change(screen.getByLabelText(/Font Weight:/), {
      target: { value: '400' },
    });
    fireEvent.click(screen.getByLabelText(/Italic:/));

    // Click the "Reset All Settings" button
    fireEvent.click(screen.getByText('Reset All Settings'));

    // Reload the component to simulate a new session
    render(<App />);

    // Wait for the component to reset
    await waitFor(() => {
      // Assert against the mock function
      expect(window.alert).toHaveBeenCalledWith('All settings reset successfully!');
      // Add your assertions for checking reset settings here
    });
  });
});
