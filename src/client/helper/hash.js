const hash = (input) => {
	let hash = 0;
	if (input.length === 0) return hash;
	for (let i = 0; i < input.length; i++) {
		const chr = input.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

export default hash;
