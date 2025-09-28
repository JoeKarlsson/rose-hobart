import React from 'react';
import renderer from 'react-test-renderer';
import {
	shallow,
	configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ImagePickable from './ImagePickable';

configure({ adapter: new Adapter() });

describe('ImagePickable', () => {
	let wrapper;
	let inst;
	const mockhandleChange = jest.fn();

	beforeEach(() => {
		wrapper = shallow(<ImagePickable onChange={mockhandleChange} />);
		inst = wrapper.instance();
	});

	describe('rendering', () => {
		describe('initial state', () => {
			it('match the snapshot', () => {
				const component = renderer.create(<ImagePickable onChange={mockhandleChange} />);
				const tree = component.toJSON();
				expect(tree).toMatchSnapshot();
			});
			it('is rendered correctly', () => {
				expect(wrapper).toHaveLength(1);
			});
			it('should not have any inital props', () => {
				const initialProps = inst.props;
				const expectedProps = {
					style: '',
					src: '',
					selected: false,
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
