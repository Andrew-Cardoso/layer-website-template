import {
	iconBriefcase,
	iconCardContact,
	iconHome,
	iconInfo,
	iconPerson,
} from './svg-icons.module.js';
import autosize from '../libraries/autosize/autosize.esm.js';
import sal from '../libraries/sal/sal.js';

let currentScreen;

const navLinksIcons = [
	['banner', 'início', iconHome],
	['about', 'sobre', iconPerson],
	['services', 'serviços', iconBriefcase],
	['info', 'informações', iconInfo],
	['contact', 'contato', iconCardContact],
];

const isInPage = (pageHeight, a) =>
	!a.classList.contains('active') && get(a.getAttribute`href`).offsetTop - 150 <= pageHeight;

const isPhoneScreen = () => window.matchMedia('(max-width: 699px)').matches;

const html = (elString) => {
	const container = document.createElement`div`;
	const fragment = document.createDocumentFragment();
	container.innerHTML = elString;
	fragment.appendChild(container.firstElementChild);
	container.remove();
	return fragment.firstElementChild;
};

const get = (elName) => document.querySelector(elName);

const toggleMonitorMenu = () =>
	[get`#btn-burger`, get`nav`, get`.wrapper`].forEach((el) => el.classList.toggle`active`);

const togglePhoneMenu = ({currentTarget}) => {
	currentTarget.parentElement.querySelector('.active')?.classList.remove('active');
	currentTarget.classList.add('active');
};

const onScroll = () => get`header`?.classList.toggle('sticky', window.scrollY > 0);

const handleActiveLink = ({currentTarget: {scrollTop}}) =>
	isPhoneScreen() &&
	get`#phone-nav`.querySelectorAll`a`.forEach(
		(a) => isInPage(scrollTop, a) && togglePhoneMenu({currentTarget: a}),
	);

const appendMonitorNavigation = () => {
	if (currentScreen === 'Monitor') return;
	currentScreen = 'Monitor';

	if (get`#monitor-nav`) return;

	if (get`#phone-nav`) document.body.removeChild(get`#phone-nav`);

	const nav = html(
		`<nav id="monitor-nav"><ul>${navLinksIcons
			.map(([id, title]) => `<li><a href="#${id}">${title}</a></li>`)
			.join('')}</ul></nav>`,
	);
	nav.querySelectorAll`a`.forEach((a) => a.addEventListener('click', toggleMonitorMenu));

	const header = html`
		<header>
			<a href="#" class="logo">O logo pode ficar aqui</a>
			<button id="btn-burger" aria-label="Abrir menu">
				<span></span>
			</button>
		</header>
	`;

	header.querySelector`#btn-burger`.addEventListener('click', toggleMonitorMenu);

	get`.wrapper`.prepend(nav, header);
};

const appendPhoneNavigation = () => {
	if (currentScreen === 'Phone') return;
	currentScreen = 'Phone';

	if (get`#phone-nav`) return;

	if (get`#monitor-nav`) get`.wrapper`.removeChild(get`#monitor-nav`);
	if (get`header`) get`.wrapper`.removeChild(get`header`);

	const nav = html(
		`<footer id="phone-nav">${navLinksIcons
			.map(([id, title, icon]) => `<a href="#${id}">${icon}<span>${title}</span></a>`)
			.join('')}</footer>`,
	);

	nav.querySelectorAll`a`.forEach((a) => a.addEventListener('click', togglePhoneMenu));

	document.body.appendChild(nav);
	nav.querySelector`a`.click();
};
const onResize = () => (isPhoneScreen() ? appendPhoneNavigation() : appendMonitorNavigation());

export const initDom = () => {
	autosize(get`textarea`);
	sal({once: true});
	onResize();
	window.addEventListener('resize', onResize);
	window.addEventListener('scroll', onScroll);
	get`.wrapper`.addEventListener('scroll', handleActiveLink);
};
