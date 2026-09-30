const pageLoader = document.querySelector("#page-loader");
const loaderTrack = document.querySelector(".loader-track");
const loaderProgress = document.querySelector(".loader-progress");
let loadingProgress = 0;
let loaderFinished = false;

function setLoadingProgress(value) {
	loadingProgress = Math.min(100, Math.max(loadingProgress, value));
	loaderProgress.style.width = `${loadingProgress}%`;
	loaderTrack.setAttribute("aria-valuenow", Math.round(loadingProgress));
}

function finishLoading() {
	if (loaderFinished) return;
	loaderFinished = true;
	window.clearInterval(progressTimer);
	window.clearTimeout(loaderTimeout);
	setLoadingProgress(100);
	window.setTimeout(() => {
		pageLoader.classList.add("is-hidden");
		document.body.classList.remove("is-loading");
	}, 260);
}

pageLoader.hidden = false;
document.body.classList.add("is-loading");
const progressTimer = window.setInterval(() => setLoadingProgress(loadingProgress + 1.5), 120);
const loaderTimeout = window.setTimeout(finishLoading, 4500);

if (document.readyState === "complete") {
	finishLoading();
} else {
	window.addEventListener("load", finishLoading, { once: true });
}

const revealItems = document.querySelectorAll(".reveal");
const progressBar = document.querySelector(".scroll-progress");
const toast = document.querySelector(".toast");
let toastTimer;

const mainNav = document.querySelector("#main-nav");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenuQuery = window.matchMedia("(max-width: 760px)");

function setMenuOpen(isOpen) {
	const open = mobileMenuQuery.matches && isOpen;
	mainNav.classList.toggle("is-open", open);
	mainNav.inert = mobileMenuQuery.matches && !open;
	menuToggle.setAttribute("aria-expanded", String(open));
	menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
	menuToggle.title = open ? "Tutup menu" : "Buka menu";
}

setMenuOpen(false);

menuToggle.addEventListener("click", () => {
	setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

mainNav.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("pointerdown", (event) => {
	if (mobileMenuQuery.matches && menuToggle.getAttribute("aria-expanded") === "true" &&
		!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
		setMenuOpen(false);
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
		setMenuOpen(false);
		menuToggle.focus();
	}
});

mobileMenuQuery.addEventListener("change", () => setMenuOpen(false));

const heroVisual = document.querySelector(".hero-visual");
const photoFrame = heroVisual?.querySelector(".photo-frame");
const profileOrbit = heroVisual?.querySelector(".profile-orbit");
const donationQrFrame = document.querySelector(".donation-qr-frame");
const supportsPointerTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (heroVisual && photoFrame && supportsPointerTilt) {
	heroVisual.addEventListener("pointermove", (event) => {
		const bounds = heroVisual.getBoundingClientRect();
		const horizontalPosition = (event.clientX - bounds.left) / bounds.width * 2 - 1;
		const verticalPosition = (event.clientY - bounds.top) / bounds.height * 2 - 1;

		photoFrame.style.setProperty("--tilt-x", `${-verticalPosition * 4}deg`);
		photoFrame.style.setProperty("--tilt-y", `${horizontalPosition * 4}deg`);
		profileOrbit?.style.setProperty("--orbit-tilt-x", `${verticalPosition * 3}deg`);
		profileOrbit?.style.setProperty("--orbit-tilt-y", `${-horizontalPosition * 3}deg`);
	});

	heroVisual.addEventListener("pointerleave", () => {
		photoFrame.style.setProperty("--tilt-x", "0deg");
		photoFrame.style.setProperty("--tilt-y", "0deg");
		profileOrbit?.style.setProperty("--orbit-tilt-x", "0deg");
		profileOrbit?.style.setProperty("--orbit-tilt-y", "0deg");
	});
}

if (donationQrFrame && supportsPointerTilt) {
	donationQrFrame.addEventListener("pointermove", (event) => {
		const bounds = donationQrFrame.getBoundingClientRect();
		const horizontalPosition = (event.clientX - bounds.left) / bounds.width * 2 - 1;
		const verticalPosition = (event.clientY - bounds.top) / bounds.height * 2 - 1;

		donationQrFrame.style.setProperty("--qr-tilt-x", `${-verticalPosition * 2}deg`);
		donationQrFrame.style.setProperty("--qr-tilt-y", `${horizontalPosition * 2}deg`);
	});

	donationQrFrame.addEventListener("pointerleave", () => {
		donationQrFrame.style.setProperty("--qr-tilt-x", "0deg");
		donationQrFrame.style.setProperty("--qr-tilt-y", "0deg");
	});
}

const typingText = document.querySelector(".typing-text");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const mottoPhrases = [
	"Terus belajar hal baru.",
	"Mengubah ide menjadi solusi.",
	"Berkarya dari Temanggung."
];

if (typingText) {
	let phraseIndex = 0;
	let characterIndex = mottoPhrases[0].length - 1;
	let isDeleting = false;
	let typingTimer;

	function typeMotto() {
		if (reducedMotionQuery.matches) {
		typingText.textContent = mottoPhrases[0];
			return;
		}

		const phrase = mottoPhrases[phraseIndex];
		characterIndex += isDeleting ? -1 : 1;
		typingText.textContent = phrase.slice(0, characterIndex);

		let delay = isDeleting ? 38 : 76;
		if (!isDeleting && characterIndex === phrase.length) {
			isDeleting = true;
			delay = 1500;
		} else if (isDeleting && characterIndex === 0) {
			isDeleting = false;
			phraseIndex = (phraseIndex + 1) % mottoPhrases.length;
			delay = 320;
		}

		typingTimer = window.setTimeout(typeMotto, delay);
	}

	typingTimer = window.setTimeout(typeMotto, 1600);
	reducedMotionQuery.addEventListener("change", () => {
		window.clearTimeout(typingTimer);
		if (reducedMotionQuery.matches) {
			typingText.textContent = mottoPhrases[0];
		} else {
			phraseIndex = 0;
			characterIndex = 0;
			isDeleting = false;
			typingTimer = window.setTimeout(typeMotto, 250);
		}
	});
}

if ("IntersectionObserver" in window) {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	revealItems.forEach((item) => revealObserver.observe(item));
} else {
	revealItems.forEach((item) => item.classList.add("is-visible"));
}

function updateScrollProgress() {
	const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
	progressBar.style.setProperty("--scroll-progress", progress);
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

document.querySelectorAll('a[href^="#"]:not([data-link-placeholder])').forEach((link) => {
	link.addEventListener("click", (event) => {
		const target = document.querySelector(link.getAttribute("href"));
		if (target) {
			event.preventDefault();
			target.scrollIntoView({ behavior: "smooth", block: "start" });
			history.replaceState(null, "", link.getAttribute("href"));
		}
	});
});

document.querySelectorAll("[data-link-placeholder]").forEach((link) => {
	link.addEventListener("click", (event) => {
		if (link.getAttribute("href") === "#") {
			event.preventDefault();
			toast.textContent = `Tautan ${link.dataset.linkPlaceholder} belum diisi.`;
			toast.classList.add("is-visible");
			window.clearTimeout(toastTimer);
			toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
		}
	});
});
