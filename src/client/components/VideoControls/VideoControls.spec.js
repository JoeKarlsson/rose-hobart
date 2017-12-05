import React from 'react';
import renderer from 'react-test-renderer';
import {
	shallow,
	configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VideoControls from './VideoControls';

configure({ adapter: new Adapter() });

describe('VideoControls', () => {
	let wrapper;
	let inst;
	let mockOnStaticBlurMapChange;
	let mockHandleColorChange;
	let mockOnHandleClick;
	let mockOnChange;

	beforeEach(() => {
		mockOnStaticBlurMapChange = jest.fn();
		mockHandleColorChange = jest.fn();
		mockOnHandleClick = jest.fn();
		mockOnChange = jest.fn();

		wrapper = shallow(
			<VideoControls
				color="monochrome"
				factor={1}
				passes={1}
				contrast={1}
				saturation={1}
				brightness={1}
				onStaticBlurMapChange={mockOnStaticBlurMapChange}
				handleColorChange={mockHandleColorChange}
				handleClick={mockOnHandleClick}
				onChange={mockOnChange}
			/>,
		);
		inst = wrapper.instance();
	});

	describe('rendering', () => {
		describe('initial state', () => {
			it('is rendered correctly', () => {
				expect(wrapper).toHaveLength(1);
			});
			it('should not have any inital props', () => {
				const initialProps = inst.props;
				const expectedProps = {
					factor: 1,
					passes: 1,
					contrast: 1,
					saturation: 1,
					brightness: 1,
					onStaticBlurMapChange: mockOnStaticBlurMapChange,
					handleClick: mockOnHandleClick,
					onChange: mockOnChange,
				};
				expect(initialProps).toMatchObject(expectedProps);
			});
			it('should not have any inital state', () => {
				const initialState = inst.state;
				const expectedState = {};
				expect(initialState).toMatchObject(expectedState);
			});
		});
	});
});
