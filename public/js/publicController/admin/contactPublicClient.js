const { adminDoms } = require('../../common/DOMs');
const { loading, hideLoading } = require('../../common/loader');
const { clientReply, deleteClient, readStatus } = require('./axiosRoutes');
const getImage = require('./getImage');

exports.clientViewer = () => {
	if (adminDoms.clientParent) {
		adminDoms.clientViewer.style.display = 'none';
		adminDoms.clientTable.addEventListener('click', async (e) => {
			e.preventDefault();
			if (e.target.classList.contains('clientViewData')) {
				loading();
				const allPhoto = JSON.parse(e.target.dataset.photos);
				adminDoms.clientName.textContent = e.target.dataset.name;
				adminDoms.clientMail.textContent = e.target.dataset.mail;
				adminDoms.clientPhone.textContent = e.target.dataset.phone;

				for await (const name of allPhoto) {
					let num = 0;
					const buff = await getImage(name);
					const img = new Image();
					img.src = buff;
					img.id = `img${(num += 1)}`;
					img.classList = 'client_view_samples--img';
					img.alt = `sample${num}`;
					adminDoms.clientSamplesBox.appendChild(img);
				}
				adminDoms.clientViewer.style.display = '';
				adminDoms.clientTable.style.display = 'none';

				readStatus({ id: e.target.dataset.identity }, 'contactClient');

				// Past replies
				while (adminDoms.clientHead.nextSibling)
					adminDoms.clientHead.nextSibling.remove();

				const replies = JSON.parse(e.target.dataset.reply);
				if (replies[0]) {
					replies.forEach((el) => {
						const html = `<div class="clientBdgt_view_past_reply">
						<h4 class="clientBdgt_view_past_reply--subject">${el.subject}</h4>
						<p class="clientBdgt_view_past_reply--msg">${el.message}</p>
						</div>`;

						adminDoms.clientHead.insertAdjacentHTML('afterend', html);
					});
				}

				hideLoading();
			}
		});
	}

	if (adminDoms.clientViewerCloser) {
		adminDoms.clientViewerCloser.forEach((el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();
				window.location.reload();
			});
		});
	}
};

exports.clientRemover = () => {
	if (adminDoms.clientTable) {
		adminDoms.clientTable.addEventListener('click', (e) => {
			e.preventDefault();
			if (e.target.classList.contains('removeClientData')) {
				const ans = confirm('Are you sure?');
				if (ans) {
					loading();
					deleteClient(e.target.dataset.delete);
				}
			}
		});
	}
};

exports.clientReplyer = () => {
	if (adminDoms.clientReplyers) {
		adminDoms.clientReplyers.forEach((el) => {
			el.addEventListener('submit', (e) => {
				e.preventDefault();
				if (el.childNodes[0].value && el.childNodes[1].value) {
					loading();
					clientReply({
						subject: el.childNodes[0].value,
						message: el.childNodes[1].value,
						email: adminDoms.clientMail.textContent,
						name: adminDoms.clientName.textContent,
						type: 'contact',
					});
					el.childNodes[0].value = '';
					el.childNodes[1].value = '';
				}
			});
		});
	}
};
