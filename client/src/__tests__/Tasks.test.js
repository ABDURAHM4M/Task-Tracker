import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tasks from '../pages/Tasks';
import api from '../axios';

jest.mock('../axios');

test('renders heading and add form', async () => {
  api.get.mockResolvedValue({ data:{tasks:[]} });
  render(<MemoryRouter><Tasks/></MemoryRouter>);
  expect(await screen.findByText(/My Tasks/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/New Task/i)).toBeInTheDocument();
});
