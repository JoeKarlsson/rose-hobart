import React from 'react';
import renderer from 'react-test-renderer';
import {
	shallow,
	configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FloatSlider from './FloatSlider';

configure({ adapter: new Adapter() });

describe('FloatSlider', () => {
	let wrapper;
	let inst;
	const mockhandleChange = jest.fn();

	beforeEach(() => {
		wrapper = shallow(<FloatSlider handleChange={mockhandleChange} />);
		inst = wrapper.instance();
	});

	describe('rendering', () => {
		describe('initial state', () => {
			it('match the snapshot', () => {
				const component = renderer.create(<FloatSlider handleChange={mockhandleChange} />);
				const tree = component.toJSON();
				expect(tree).toMatchSnapshot();
			});
			it('is rendered correctly', () => {
				expect(wrapper).toHaveLength(1);
			});
			it('should not have any inital props', () => {
				const initialProps = inst.props;
				const expectedProps = {
					title: '',
					min: 0,
					max: 1,
					step: 1,
					handleChange: mockhandleChange,
				};
				expect(initialProps).toMatchObject(expectedProps);
			});
			it('should not have any inital state', () => {
				const initialState = inst.state;
				const expectedState = {
					value: 0,
				};
				expect(initialState).toMatchObject(expectedState);
			});
		});
	});
});
