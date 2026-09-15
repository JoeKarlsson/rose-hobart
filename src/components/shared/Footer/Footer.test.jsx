import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

const renderFooter = () => render(
	<MemoryRouter>
		<Footer />
	</MemoryRouter>
);

describe('Footer', () => {
	it('renders without crashing', () => {
		const { container } = renderFooter();
		expect(container.firstChild).toBeTruthy();
	});

	it('renders the About internal link', () => {
		renderFooter();
		expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
	});

	it('renders exactly one GitHub link (no duplicates)', () => {
		renderFooter();
		const githubLinks = screen.getAllByRole('link', { name: /github/i });
		expect(githubLinks).toHaveLength(1);
	});

	it('GitHub link points to the correct repo', () => {
		renderFooter();
		const link = screen.getByRole('link', { name: /github/i });
		expect(link).toHaveAttribute('href', 'https://github.com/JoeKarlsson/rose-hobart');
	});

	it('GitHub link opens in a new tab with safe rel attribute', () => {
		renderFooter();
		const link = screen.getByRole('link', { name: /github/i });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders copyright text', () => {
		renderFooter();
		expect(screen.getByText(/Karlsson/)).toBeInTheDocument();
	});

	it('renders credit links for joe and laurel', () => {
		renderFooter();
		expect(screen.getByRole('link', { name: 'joe' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'laurel' })).toBeInTheDocument();
	});
});
