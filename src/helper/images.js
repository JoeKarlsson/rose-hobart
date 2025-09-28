const imgurify = (slugs) => {
	return slugs.split(',').map(id => `https://i.imgur.com/${id}.png`);
};

const images = imgurify('SzbbUvX,0PkQEk1,z2CQHpg,k9Eview,wh0On3P');

export default images;
