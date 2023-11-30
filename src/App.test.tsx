// App.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers

import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    // Mock local storage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByLabelText('Font Family:')).toBeInTheDocument();
    expect(screen.getByLabelText('Font Weight:')).toBeInTheDocument();
    expect(screen.getByLabelText('Italic:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Reset All')).toBeInTheDocument();
  });

  it('updates content on textarea change', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Enter message');
    fireEvent.change(textarea, { target: { value: 'Test Content' } });
    expect(textarea.value).toBe('Test Content');
  });

  it('selects font family and updates font weights', () => {
    render(<App />);
    const fontFamilySelect = screen.getByLabelText('Font Family:') as HTMLSelectElement;
    fireEvent.change(fontFamilySelect, { target: { value: 'ABeeZee' } });

    expect(fontFamilySelect.value).toBe('ABeeZee');

    const fontWeightSelect = screen.getByLabelText('Font Weight:') as HTMLSelectElement;
    expect(fontWeightSelect.value).toBe('400'); // Font weights should be cleared initially

    // Mock Google Fonts data for ABeeZee 
    const googleFontsData = {
      ABeeZee : {
        '400': 'https://example.com/ABeeZee -regular.woff2',
        '700': 'https://example.com/ABeeZee -bold.woff2',
      },
    };

    jest.spyOn(window, 'localStorage', 'get')
      .mockReturnValueOnce(null) // Mock saved content
      .mockReturnValueOnce(null) // Mock saved font family
      .mockReturnValueOnce(null) // Mock saved font weight
      .mockReturnValueOnce(null); // Mock saved italic

    // Mock fetch to return Google Fonts data
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve(googleFontsData),
    } as Response);

    fireEvent.change(fontFamilySelect, { target: { value: 'ABeeZee' } });

    // Font weights should be updated based on the selected font family
    expect(fontWeightSelect.value).toBe('400');
    expect(screen.getByTestId('italic-switch')).toHaveAttribute('checked', null);

    // Reset the mocks
    jest.resetAllMocks();
  });

  it('saves and loads content from local storage', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Enter message');
    fireEvent.change(textarea, { target: { value: 'Test Content' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Verify that the saveText function is called and local storage is updated
    expect(window.localStorage.setItem).toHaveBeenCalledWith('editorContent', 'Test Content');

    // Reset local storage mock
    window.localStorage.setItem.mockClear();

    // Render the component again to trigger loadSavedText
    render(<App />);

    // Verify that loadSavedText is called and content is loaded from local storage
    expect(window.localStorage.getItem).toHaveBeenCalledWith('editorContent');
    expect(textarea.value).toBe('Test Content');
  });

  it('resets all settings and clears local storage', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Enter message');
    fireEvent.change(textarea, { target: { value: 'Test Content' } });

    const resetButton = screen.getByText('Reset All');
    fireEvent.click(resetButton);

    // Verify that the resetAll function is called and local storage is cleared
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('editorContent');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('selectedFont');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('selectedWeight');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('isItalic');

    // Reset local storage mock
    window.localStorage.removeItem.mockClear();

    // Render the component again to trigger loadSavedText
    render(<App />);

    // Verify that loadSavedText is called and content is not loaded from local storage
    expect(window.localStorage.getItem).not.toHaveBeenCalledWith('editorContent');
    expect(textarea.value).toBe('');
  });

  it('toggles italic switch and updates font weight accordingly', () => {
    render(<App />);
    const italicSwitch = screen.getByLabelText('Italic:') as HTMLInputElement;

    // Toggle the italic switch
    fireEvent.click(italicSwitch);

    // Verify that the italic state is updated
    expect(italicSwitch).toHaveAttribute('checked',null);

    // Reset local storage mock
    window.localStorage.setItem.mockClear();

    // Render the component again to trigger the useEffect for italic
    render(<App />);

    // Verify that the italic switch is checked based on the saved state
    expect(italicSwitch).toHaveAttribute('checked',null);

    // Toggle the italic switch again
    fireEvent.click(italicSwitch);

    // Verify that the italic state is updated
    expect(italicSwitch).not.toHaveAttribute('checked',null);

    // Reset local storage mock
    window.localStorage.setItem.mockClear();

    // Render the component again to trigger the useEffect for italic
    render(<App />);

    // Verify that the italic switch is not checked based on the saved state
    expect(italicSwitch).not.toHaveAttribute('checked',null);
  });
});
