import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";

import createCache from "@emotion/cache";

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

import router from "./router";


// RTL CACHE
const rtlCache = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});


// THEME
const theme = createTheme({

    direction: "rtl",

    palette: {

        primary: {
            main: "#1565c0",
        },

        secondary: {
            main: "#2e7d32",
        },

        background: {
            default: "#f4f6f8",
        },
    },

    typography: {

        fontFamily: [
            "Rubik",
            "Arial",
            "sans-serif",
        ].join(","),
    },
});


document.body.dir = "rtl";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <CacheProvider value={rtlCache}>

            <ThemeProvider theme={theme}>

                <RouterProvider router={router} />

            </ThemeProvider>

        </CacheProvider>

    </React.StrictMode>
);