import { render, screen,queryByAttribute,waitFor } from '@testing-library/react';
import App from './App';

  test('Content is loaded within 5 seconds', async () => {
  // const result = render(<App />);
    // const child = screen.queryByTestId('content-shown');
    const getById = queryByAttribute.bind(null, 'testid');

    const dom = render(<App />);
    const table = getById(dom.container, 'content-shown');
    await waitFor(() => expect(table),{timeout:5000})
  });

