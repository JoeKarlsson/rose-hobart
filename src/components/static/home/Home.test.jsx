import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';

// Vite resolves .mp4 to a URL string in tests — stub it explicitly so the
// <source src> is predictable and the test doesn't depend on asset pipeline output.
vi.mock('../../../assets/video/video.mp4', () => ({ default: 'test-video.mp4' }));

const renderHome = () => render(
	<MemoryRouter>
		<Home />
	</MemoryRouter>
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

		it('renders all six color preset buttons', () => {
			renderHome();
			['Normal', 'Vintage', 'High Contrast', 'Black & White', 'Inverted', 'Blue Tint'].forEach(name => {
				expect(screen.getByRole('button', { name })).toBeInTheDocument();
			});
		});

		it('renders all five video control buttons', () => {
			renderHome();
			[/Play/, /Pause/, /Mute/, /Slow/, /Fast/].forEach(pattern => {
				expect(screen.getByRole('button', { name: pattern })).toBeInTheDocument();
			});
		});

		it('renders all six effect sliders', () => {
			renderHome();
			expect(screen.getAllByRole('slider')).toHaveLength(6);
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

	describe('color presets', () => {
		it('clicking Vintage updates slider labels', () => {
			renderHome();
			fireEvent.click(screen.getByRole('button', { name: 'Vintage' }));
			expect(screen.getByText('Brightness: 0.90')).toBeInTheDocument();
			expect(screen.getByText('Contrast: 1.20')).toBeInTheDocument();
			expect(screen.getByText('Sepia: 0.30')).toBeInTheDocument();
		});

		it('clicking Black & White sets saturation to zero', () => {
			renderHome();
			fireEvent.click(screen.getByRole('button', { name: 'Black & White' }));
			expect(screen.getByText('Saturation: 0.00')).toBeInTheDocument();
		});

		it('clicking Inverted sets invert to On', () => {
			renderHome();
			fireEvent.click(screen.getByRole('button', { name: 'Inverted' }));
			expect(screen.getByText('Invert: On')).toBeInTheDocument();
		});

		it('clicking Normal after Vintage resets all labels', () => {
			renderHome();
			fireEvent.click(screen.getByRole('button', { name: 'Vintage' }));
			fireEvent.click(screen.getByRole('button', { name: 'Normal' }));
			expect(screen.getByText('Brightness: 1.00')).toBeInTheDocument();
			expect(screen.getByText('Sepia: 0.00')).toBeInTheDocument();
		});

		it('clicking a preset applies CSS filter to the video element', () => {
			renderHome();
			fireEvent.click(screen.getByRole('button', { name: 'Vintage' }));
			const video = document.querySelector('video');
			expect(video.style.filter).toContain('brightness(0.9)');
			expect(video.style.filter).toContain('sepia(0.3)');
			expect(video.style.filter).toContain('saturate(0.8)');
		});
	});

	describe('effect sliders', () => {
		it('changing brightness slider updates the label and CSS filter', () => {
			renderHome();
			const sliders = screen.getAllByRole('slider');
			const brightnessSlider = sliders[0];
			fireEvent.change(brightnessSlider, { target: { value: '1.5' } });
			expect(screen.getByText('Brightness: 1.50')).toBeInTheDocument();
			const video = document.querySelector('video');
			expect(video.style.filter).toContain('brightness(1.5)');
		});

		it('changing hue slider updates the label', () => {
			renderHome();
			const sliders = screen.getAllByRole('slider');
			const hueSlider = sliders[3];
			fireEvent.change(hueSlider, { target: { value: '180' } });
			expect(screen.getByText('Hue: 180°')).toBeInTheDocument();
		});
	});
});
