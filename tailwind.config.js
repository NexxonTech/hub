module.exports = {
    content: ["./**/*.html"],
    plugins: [
	require("@tailwindcss/typography")({
	    modifiers: [],
	}),
	require("@tailwindcss/forms"),
    ],
};
