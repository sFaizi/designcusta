module.exports = async (name) => {
	const response = await fetch(`/clientSample/${name}`);
	const obj = await response.json();
	return obj.data;
};
