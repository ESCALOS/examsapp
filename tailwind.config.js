import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    100: "#ded4d8",
                    200: "#bda9b0",
                    300: "#9b7d89",
                    400: "#7a5261",
                    500: "#59273a",
                    600: "#471f2e",
                    700: "#351723",
                    800: "#241017",
                    900: "#12080c",
                },
                secondary: {
                    100: "#fcfcee",
                    200: "#faf8de",
                    300: "#f7f5cd",
                    400: "#f5f1bd",
                    500: "#f2eeac",
                    600: "#c2be8a",
                    700: "#918f67",
                    800: "#615f45",
                    900: "#303022",
                },
                accent: {
                    100: "#dae2ed",
                    200: "#b4c5db",
                    300: "#8fa8ca",
                    400: "#698bb8",
                    500: "#446ea6",
                    600: "#365885",
                    700: "#294264",
                    800: "#1b2c42",
                    900: "#0e1621",
                },
                neutral: {
                    100: "#fcfaf0",
                    200: "#faf6e2",
                    300: "#f7f1d3",
                    400: "#f5edc5",
                    500: "#f2e8b6",
                    600: "#c2ba92",
                    700: "#918b6d",
                    800: "#615d49",
                    900: "#302e24",
                },
                highlight: {
                    100: "#fcf0f0",
                    200: "#fae2e2",
                    300: "#f7d3d3",
                    400: "#f5c5c5",
                    500: "#f2b6b6",
                    600: "#c29292",
                    700: "#916d6d",
                    800: "#614949",
                    900: "#302424",
                },
            },
        },
    },

    plugins: [forms],
};
