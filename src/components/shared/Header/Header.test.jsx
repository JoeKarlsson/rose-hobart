import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from './Header';

const renderHeader = (initialPath = '/') => render(
	<MemoryRouter initialEntries={[initialPath]}>
		<Header />
	</MemoryRouter>
);

describe('Header', () => {
	it('renders without crashing', () => {
		const { container } = renderHeader();
		expect(container.firstChild).toBeTruthy();
	});

	it('renders the Rose Hobart title', () => {
		renderHeader();
		expect(screen.getByText('Rose Hobart')).toBeInTheDocument();
	});

	it('renders the "now playing" subtitle', () => {
		renderHeader();
		expect(screen.getByText('now playing')).toBeInTheDocument();
	});

	it('renders the Film nav link', () => {
		renderHeader();
		expect(screen.getByRole('link', { name: /film/i })).toBeInTheDocument();
	});

	it('renders the Supporting Statement nav link', () => {
		renderHeader();
		expect(screen.getByRole('link', { name: /supporting statement/i })).toBeInTheDocument();
	});

	it('Supporting Statement link points to /about', () => {
		renderHeader();
		const link = screen.getByRole('link', { name: /supporting statement/i });
		expect(link).toHaveAttribute('href', '/about');
	});

	it('Film link points to /', () => {
		renderHeader();
		const link = screen.getByRole('link', { name: /film/i });
		expect(link).toHaveAttribute('href', '/');
	});

	it('brand logo links to home (/)', () => {
		renderHeader();
		const brandLink = screen.getByRole('link', { name: /rose hobart/i });
		expect(brandLink).toHaveAttribute('href', '/');
	});
});
