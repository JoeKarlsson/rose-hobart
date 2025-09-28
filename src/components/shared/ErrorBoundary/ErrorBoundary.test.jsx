import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

describe('Error Boundary', () => {
	describe('rendering', () => {
		describe('initial state', () => {
			it('should match the snapshot', () => {
				const { container } = render(
					<ErrorBoundary>
						When you buy a lottery ticket, you are investing in the dreams of the winner.
					</ErrorBoundary>,
				);
				expect(container.firstChild).toMatchSnapshot();
			});

			it('is rendered correctly', () => {
				render(
					<ErrorBoundary>
						When you buy a lottery ticket, you are investing in the dreams of the winner.
					</ErrorBoundary>,
				);
				expect(screen.getByText('When you buy a lottery ticket, you are investing in the dreams of the winner.')).toBeInTheDocument();
			});

			it('should render children when no error occurs', () => {
				render(
					<ErrorBoundary>
						When you buy a lottery ticket, you are investing in the dreams of the winner.
					</ErrorBoundary>,
				);
				expect(screen.getByText('When you buy a lottery ticket, you are investing in the dreams of the winner.')).toBeInTheDocument();
			});
		});
	});

	describe('error handling', () => {
		class BuggyComponent extends React.Component {
			componentDidMount() {
				throw new Error('I crashed!');
			}
			render() {
				return <h1>Buggy Component</h1>;
			}
		}

		it('should render error message when child component throws error', () => {
			// Mock console.error to avoid error output in test
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			
			render(
				<ErrorBoundary>
					<BuggyComponent />
				</ErrorBoundary>,
			);

			expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
			
			consoleSpy.mockRestore();
		});
	});
});
