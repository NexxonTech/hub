document.addEventListener('alpine:init', () => {
    Alpine.data('global', () => ({
	isMobileMenuOpen: false,
	isDarkMode: false,
	themeInit: function() {
	    if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
		localStorage.theme = "dark";
		document.documentElement.setAttribute("data-theme", "dark")
		this.isDarkMode = true;
	    } else {
		localStorage.theme = "light";
		document.documentElement.setAttribute("data-theme", "light")
		this.isDarkMode = false;
	    }
	},
	themeSwitch: function() {
	    if (localStorage.theme === "dark") {
		localStorage.theme = "light";
		document.documentElement.setAttribute("data-theme", "light")
		this.isDarkMode = false;
	    } else {
		localStorage.theme = "dark";
		document.documentElement.setAttribute("data-theme", "dark")
		this.isDarkMode = true;
	    }
	},
	sendUserTo: function(dest) {
	    window.location.href = dest;
	}
    }));
});
