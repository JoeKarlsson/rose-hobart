import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';
import { AudioProvider } from '../../../context/AudioContext';

// Vite resolves .mp4 to a URL string in tests — stub it explicitly so the
// <source src> is predictable and the test doesn't depend on asset pipeline output.
vi.mock('../../../assets/video/video.mp4', () => ({ default: 'test-video.mp4' }));

const renderHome = () => render(
	<AudioProvider>
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	</AudioProvider>
);

describe('Home', () => {
	describe('rendering', () => {
		it('renders without crashing', () => {
			const { container } = renderHome();
			expect(container.firstChild).toBeTruthy();
		});

		it('renders a video element with a source', () => {
			renderHome();
			const video = document.querySelector('video');
			expect(video).toBeInTheDocument();
			const source = video.querySelector('source[type="video/mp4"]');
			expect(source).toBeInTheDocument();
		});

		it('renders all seven tint preset buttons', () => {
			renderHome();
			// Buttons use title={preset.name} — no text content — so accessible name comes from title
			['None', 'Prussian', 'Violet', 'Rose', 'Amber', 'Jade', 'Crimson'].forEach(name => {
				expect(screen.getByRole('button', { name })).toBeInTheDocument();
			});
		});

		it('renders all five video control buttons', () => {
			renderHome();
			[/Play/, /Pause/, /Mute/, /Slow/, /Fast/].forEach(pattern => {
				expect(screen.getByRole('button', { name: pattern })).toBeInTheDocument();
			});
		});

		it('renders all eight sliders', () => {
			renderHome();
			// 1 tint intensity + 1 music volume + 6 effect sliders
			expect(screen.getAllByRole('slider')).toHaveLength(8);
		});

		it('shows initial slider label values', () => {
			renderHome();
			expect(screen.getByText('Brightness: 1.00')).toBeInTheDocument();
			expect(screen.getByText('Contrast: 1.00')).toBeInTheDocument();
			expect(screen.getByText('Saturation: 1.00')).toBeInTheDocument();
			expect(screen.getByText('Hue: 0°')).toBeInTheDocument();
			expect(screen.getByText('Sepia: 0.00')).toBeInTheDocument();
			expect(screen.getByText('Invert: Off')).toBeInTheDocument();
		});
	});

	describe('color tint presets', () => {
		it('clicking a tint preset marks its button active', () => {
			renderHome();
			const btn = screen.getByRole('button', { name: 'Prussian' });
			fireEvent.click(btn);
			expect(btn.classList.contains('active')).toBe(true);
		});

		it('clicking None sets tint overlay opacity to 0', () => {
			const { container } = renderHome();
			fireEvent.click(screen.getByRole('button', { name: 'Prussian' }));
			fireEvent.click(screen.getByRole('button', { name: 'None' }));
			const overlay = container.querySelector('.tint-overlay');
			expect(parseFloat(overlay.style.opacity)).toBe(0);
		});

		it('clicking a preset applies a non-zero opacity to the overlay', () => {
			const { container } = renderHome();
			fireEvent.click(screen.getByRole('button', { name: 'Prussian' }));
			const overlay = container.querySelector('.tint-overlay');
			expect(parseFloat(overlay.style.opacity)).toBeGreaterThan(0);
		});

		it('clicking a second preset deactivates the first', () => {
			renderHome();
			const prussian = screen.getByRole('button', { name: 'Prussian' });
			const violet = screen.getByRole('button', { name: 'Violet' });
			fireEvent.click(prussian);
			fireEvent.click(violet);
			expect(prussian.classList.contains('active')).toBe(false);
			expect(violet.classList.contains('active')).toBe(true);
		});
	});

	describe('effect sliders', () => {
		it('changing brightness slider updates the label and CSS filter', () => {
			renderHome();
			// DOM order: [0]=tint intensity, [1]=music volume, [2]=brightness
			const sliders = screen.getAllByRole('slider');
			const brightnessSlider = sliders[2];
			fireEvent.change(brightnessSlider, { target: { value: '1.5' } });
			expect(screen.getByText('Brightness: 1.50')).toBeInTheDocument();
			const video = document.querySelector('video');
			expect(video.style.filter).toContain('brightness(1.5)');
		});

		it('changing hue slider updates the label', () => {
			renderHome();
			// DOM order: [0]=tint intensity, [1]=volume, [2]=brightness, [3]=contrast, [4]=saturation, [5]=hue
			const sliders = screen.getAllByRole('slider');
			const hueSlider = sliders[5];
			fireEvent.change(hueSlider, { target: { value: '180' } });
			expect(screen.getByText('Hue: 180°')).toBeInTheDocument();
		});
	});
});
