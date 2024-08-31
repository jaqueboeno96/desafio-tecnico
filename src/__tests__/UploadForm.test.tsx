import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadForm from '../components/UploadForm';
import { JSX } from 'react/jsx-runtime';

describe('UploadForm Component', () => {
  it('should render the form', () => {
    const { getByPlaceholderText, getByText } = render(<UploadForm />);

    expect(getByPlaceholderText('Customer Code')).toBeInTheDocument();
    expect(getByText('Upload')).toBeInTheDocument();
  });
//continuar os testes ...
});


