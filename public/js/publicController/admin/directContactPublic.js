const { adminDoms } = require('../../common/DOMs');
const { loading, hideLoading } = require('../../common/loader');
const { clientReply, deleteMail, readStatus } = require('./axiosRoutes');
const getImage = require('./getImage');

exports.dmViewer = () => {
	if (adminDoms.dmParent) {
		adminDoms.dmViewer.style.display = 'none';
		adminDoms.dmTable.addEventListener('click', async (e) => {
			e.preventDefault();
			if (e.target.classList.contains('viewDirectMail')) {
				loading();
				const allPhoto = JSON.parse(e.target.dataset.attachments);
				adminDoms.dmName.textContent = e.target.dataset.name;
				adminDoms.dmMail.textContent = e.target.dataset.email;
				adminDoms.dmSubject.textContent = e.target.dataset.subject;
				adminDoms.dmTo.textContent = e.target.dataset.to;
				adminDoms.dmText.textContent = e.target.dataset.text;

				for await (const name of allPhoto) {
					let num = 0;
					const buff = await getImage(name);
					const img = new Image();
					img.src = buff;
					img.id = `dmImg${(num += 1)}`;
					img.classList = 'directMail_view_samples--img';
					img.alt = `sample${num}`;
					adminDoms.dmSampleBox.appendChild(img);
				}
				adminDoms.dmViewer.style.display = '';
				adminDoms.dmTable.style.display = 'none';

				readStatus({ id: e.target.dataset.identity }, 'directContact');

				// Past replies
				while (adminDoms.dmHead.nextSibling)
					adminDoms.dmHead.nextSibling.remove();

				const replies = JSON.parse(e.target.dataset.reply);
				if (replies[0]) {
					replies.forEach((el) => {
						const html = `<div class="directMail_view_past_reply">
						<h4 class="directMail_view_past_reply--subject">${el.subject}</h4>
						<p class="directMail_view_past_reply--msg">${el.message}</p>
						</div>`;

						adminDoms.dmHead.insertAdjacentHTML('afterend', html);
					});
				}

				hideLoading();
			}
		});
	}

	if (adminDoms.dmViewerCloser) {
		adminDoms.dmViewerCloser.forEach((el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();
				window.location.reload();
			});
		});
	}
};

exports.dmReplyer = () => {
	if (adminDoms.dmReplyers) {
		adminDoms.dmReplyers.forEach((el) => {
			el.addEventListener('submit', (e) => {
				e.preventDefault();
				if (el.childNodes[0].value && el.childNodes[1].value) {
					loading();
					clientReply({
						subject: el.childNodes[0].value,
						message: el.childNodes[1].value,
						email: adminDoms.dmMail.textContent,
						name: adminDoms.dmName.textContent,
						type: 'directMail',
					});
					el.childNodes[0].value = '';
					el.childNodes[1].value = '';
				}
			});
		});
	}
};

exports.dmRemover = () => {
	if (adminDoms.dmTable) {
		adminDoms.dmTable.addEventListener('click', (e) => {
			e.preventDefault();
			if (e.target.classList.contains('removeDirectMail')) {
				const ans = confirm('Are you sure?');
				if (ans) {
					loading();
					deleteMail(e.target.dataset.delete);
				}
			}
		});
	}
};
