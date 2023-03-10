'use strict';
const modal = document.querySelector('.modal'),
	overlay = document.querySelector('.overlay'),
	btnCloseModal = document.querySelector('.btn--close-modal'),
	btnsOpenModal = document.querySelectorAll('.btn--show-modal'),
	btnScrollTo = document.querySelector('.btn--scroll-to'),
	section1 = document.querySelector('#section--1'),
	nav = document.querySelector('.nav'),
	tabs = document.querySelectorAll('.operations__tab'),
	tabsContainer = document.querySelector('.operations__tab-container'),
	tabsContent = document.querySelectorAll('.operations__content'),
	openModal = function (e) {
		e.preventDefault(),
			modal.classList.remove('hidden'),
			overlay.classList.remove('hidden');
	},
	closeModal = function () {
		modal.classList.add('hidden'), overlay.classList.add('hidden');
	};
btnsOpenModal.forEach((e) => e.addEventListener('click', openModal)),
	btnCloseModal.addEventListener('click', closeModal),
	overlay.addEventListener('click', closeModal),
	document.addEventListener('keydown', function (e) {
		'Escape' !== e.key || modal.classList.contains('hidden') || closeModal();
	}),
	btnScrollTo.addEventListener('click', function (e) {
		const t = section1.getBoundingClientRect();
		console.log(t),
			console.log(e.target.getBoundingClientRect()),
			console.log(
				'Current scroll (X/Y)',
				window.pageXOffset,
				window.pageYOffset
			),
			console.log(
				'height/width viewport',
				document.documentElement.clientHeight,
				document.documentElement.clientWidth
			),
			section1.scrollIntoView({ behavior: 'smooth' });
	}),
	document.querySelector('.nav__links').addEventListener('click', function (e) {
		if ((e.preventDefault(), e.target.classList.contains('nav__link'))) {
			const t = e.target.getAttribute('href');
			document.querySelector(t).scrollIntoView({ behavior: 'smooth' });
		}
	}),
	tabsContainer.addEventListener('click', function (e) {
		const t = e.target.closest('.operations__tab');
		t &&
			(tabs.forEach((e) => e.classList.remove('operations__tab--active')),
			tabsContent.forEach((e) =>
				e.classList.remove('operations__content--active')
			),
			t.classList.add('operations__tab--active'),
			document
				.querySelector(`.operations__content--${t.dataset.tab}`)
				.classList.add('operations__content--active'));
	});
const handleHover = function (e) {
	if (e.target.classList.contains('nav__link')) {
		const t = e.target,
			o = t.closest('.nav').querySelectorAll('.nav__link'),
			n = t.closest('.nav').querySelector('img');
		o.forEach((e) => {
			e !== t && (e.style.opacity = this);
		}),
			(n.style.opacity = this);
	}
};
nav.addEventListener('mouseover', handleHover.bind(0.5)),
	nav.addEventListener('mouseout', handleHover.bind(1));
const header = document.querySelector('.header'),
	navHeight = nav.getBoundingClientRect().height,
	stickyNav = function (e) {
		const [t] = e;
		t.isIntersecting
			? nav.classList.remove('sticky')
			: nav.classList.add('sticky');
	},
	headerObserver = new IntersectionObserver(stickyNav, {
		root: null,
		threshold: 0,
		rootMargin: `-${navHeight}px`,
	});
headerObserver.observe(header);
const allSections = document.querySelectorAll('.section'),
	revealSection = function (e, t) {
		const [o] = e;
		o.isIntersecting &&
			(o.target.classList.remove('section--hidden'), t.unobserve(o.target));
	},
	sectionObserver = new IntersectionObserver(revealSection, {
		root: null,
		threshold: 0.15,
	});
allSections.forEach(function (e) {
	sectionObserver.observe(e), e.classList.add('section--hidden');
});
const imgTargets = document.querySelectorAll('img[data-src]'),
	loadImg = function (e, t) {
		const [o] = e;
		o.isIntersecting &&
			((o.target.src = o.target.dataset.src),
			o.target.addEventListener('load', function () {
				o.target.classList.remove('lazy-img');
			}),
			t.unobserve(o.target));
	},
	imgObserver = new IntersectionObserver(loadImg, {
		root: null,
		threshold: 0,
		rootMargin: '200px',
	});
imgTargets.forEach((e) => imgObserver.observe(e));
const slider = function () {
	const e = document.querySelectorAll('.slide'),
		t = document.querySelector('.slider__btn--left'),
		o = document.querySelector('.slider__btn--right'),
		n = document.querySelector('.dots');
	let s = 0;
	const c = e.length,
		r = function (e) {
			document
				.querySelectorAll('.dots__dot')
				.forEach((e) => e.classList.remove('dots__dot--active')),
				document
					.querySelector(`.dots__dot[data-slide="${e}"]`)
					.classList.add('dots__dot--active');
		},
		a = function (t) {
			e.forEach(
				(e, o) => (e.style.transform = `translateX(${100 * (o - t)}%)`)
			);
		},
		i = function () {
			s === c - 1 ? (s = 0) : s++, a(s), r(s);
		},
		l = function () {
			0 === s ? (s = c - 1) : s--, a(s), r(s);
		};
	a(0),
		e.forEach(function (e, t) {
			n.insertAdjacentHTML(
				'beforeend',
				`<button class="dots__dot" data-slide="${t}"></button>`
			);
		}),
		r(0),
		o.addEventListener('click', i),
		t.addEventListener('click', l),
		document.addEventListener('keydown', function (e) {
			'ArrowLeft' === e.key && l(), 'ArrowRight' === e.key && i();
		}),
		n.addEventListener('click', function (e) {
			if (e.target.classList.contains('dots__dot')) {
				const { slide: t } = e.target.dataset;
				a(t), r(t);
			}
		});
};
slider();
