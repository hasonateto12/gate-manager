import React, {

    useMemo,
    useState,
    createContext,

} from "react";

import ReactDOM from "react-dom/client";

import { AuthProvider } from "./context/AuthContext";

import { RouterProvider } from "react-router-dom";

import {

    ThemeProvider,
    createTheme,
    CssBaseline,

} from "@mui/material";

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


// DARK MODE CONTEXT

export const ColorModeContext =
    createContext({

        toggleColorMode: () => {},
    });


function AppWrapper() {

    const [darkMode, setDarkMode] =
        useState(false);


    // TOGGLE

    const colorMode = useMemo(

        () => ({

            toggleColorMode: () => {

                setDarkMode((prev) => !prev);
            },

        }),

        []
    );


    // THEME

    const theme = useMemo(() =>

            createTheme({

                direction: "rtl",

                palette: {

                    mode:
                        darkMode
                            ? "dark"
                            : "light",

                    primary: {
                        main: "#1565c0",
                    },

                    secondary: {
                        main: "#2e7d32",
                    },

                    background: darkMode

                        ? {

                            default: "#121212",

                            paper: "#1e1e1e",
                        }

                        : {

                            default: "#f4f6f8",

                            paper: "#ffffff",
                        },
                },

                typography: {

                    fontFamily: [

                        "Rubik",

                        "Arial",

                        "sans-serif",

                    ].join(","),
                },

            }),

        [darkMode]
    );


    document.body.dir = "rtl";


    return (

        <ColorModeContext.Provider
            value={colorMode}
        >

            <CacheProvider value={rtlCache}>

                <ThemeProvider theme={theme}>

                    <CssBaseline />

                    <AuthProvider>

                        <RouterProvider
                            router={router}
                        />

                    </AuthProvider>

                </ThemeProvider>

            </CacheProvider>

        </ColorModeContext.Provider>
    );
}


ReactDOM.createRoot(

    document.getElementById("root")

).render(

    <React.StrictMode>

        <AppWrapper />

    </React.StrictMode>
);