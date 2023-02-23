const refreshLoader = () => {
	const el = document.querySelector('.loader');
	if (el) el.remove();
};

exports.hideLoading = () => {
	refreshLoader();
};

exports.loading = () => {
	refreshLoader();
	const markup = `
    <div class="loader">
      <div class="loader--ring"></div>
      <div class="loader--text">loading...</div>
    </div>
  `;

	if (document.querySelector('body'))
		document.querySelector('body').insertAdjacentHTML('afterBegin', markup);
};
