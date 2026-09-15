import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NoMatch from './NoMatch';

describe('NoMatch', () => {
	it('renders without crashing', () => {
		const { container } = render(<NoMatch />);
		expect(container.firstChild).toBeTruthy();
	});

	it('renders a "No Page Found" message', () => {
		render(<NoMatch />);
		expect(screen.getByText('No Page Found')).toBeInTheDocument();
	});
});
