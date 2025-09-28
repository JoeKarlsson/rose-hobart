import React from 'react';
import {
	shallow,
	configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VideoPlayer from './VideoPlayer';

configure({ adapter: new Adapter() });

describe('VideoPlayer', () => {
	let wrapper;
	let inst;

	beforeEach(() => {
		wrapper = shallow(<VideoPlayer />);
		inst = wrapper.instance();
	});

	describe('rendering', () => {
		describe('initial state', () => {
			it('is rendered correctly', () => {
				expect(wrapper).toHaveLength(1);
			});
			it('should not have any inital props', () => {
				const initialProps = inst.props;
				const expectedProps = {};
				expect(initialProps).toEqual(expectedProps);
			});
			it('should not have any inital state', () => {
				const initialState = inst.state;
				const expectedState = {
					contrast: 1,
					saturation: 1,
					brightness: 1,
					factor: 2,
					passes: 4,
					map: 'https://i.imgur.com/SzbbUvX.png',
				};
				expect(initialState).toMatchObject(expectedState);
			});
		});
	});
});
