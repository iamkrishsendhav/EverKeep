import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";


// ============================================================================
// AUTH CONTEXT
// ============================================================================

const AuthContext = createContext(null);


// ============================================================================
// AUTH PROVIDER
// ============================================================================

export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] =
        useState(null);

    const [token, setToken] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // =========================================================================
    // RESTORE AUTH SESSION
    // =========================================================================

    useEffect(() => {

        try {

            const storedToken =
                localStorage.getItem(
                    "everkeep:token"
                );

            const storedUser =
                localStorage.getItem(
                    "everkeep:user"
                );


            if (storedToken) {

                setToken(
                    storedToken
                );


                if (storedUser) {

                    setUser(
                        JSON.parse(
                            storedUser
                        )
                    );

                }

            } else if (storedUser) {

                localStorage.removeItem(
                    "everkeep:user"
                );

            }

        } catch (error) {

            console.error(
                "Unable to restore authentication:",
                error
            );


            localStorage.removeItem(
                "everkeep:token"
            );

            localStorage.removeItem(
                "everkeep:user"
            );

            setToken(null);
            setUser(null);

        } finally {

            setLoading(false);

        }

    }, []);


    // =========================================================================
    // SYNC AUTH INVALIDATION FROM API LAYER
    // =========================================================================

    useEffect(() => {

        const handleAuthLogout = () => {

            setToken(null);
            setUser(null);

        };


        window.addEventListener(
            "everkeep:auth:logout",
            handleAuthLogout
        );


        return () => {

            window.removeEventListener(
                "everkeep:auth:logout",
                handleAuthLogout
            );

        };

    }, []);


    // =========================================================================
    // LOGIN
    // =========================================================================

    const login = (
        authData
    ) => {

        const newToken =
            authData?.token;

        const newUser =
            authData?.user;


        if (!newToken) {

            throw new Error(
                "Authentication token is missing."
            );

        }


        localStorage.setItem(
            "everkeep:token",
            newToken
        );


        if (newUser) {

            localStorage.setItem(
                "everkeep:user",
                JSON.stringify(
                    newUser
                )
            );

        }


        setToken(
            newToken
        );

        setUser(
            newUser || null
        );

    };


    // =========================================================================
    // LOGOUT
    // =========================================================================

    const logout = () => {

        localStorage.removeItem(
            "everkeep:token"
        );

        localStorage.removeItem(
            "everkeep:user"
        );

        localStorage.removeItem(
            "everkeep:auth"
        );

        sessionStorage.removeItem(
            "everkeep:auth"
        );


        setToken(null);
        setUser(null);

        window.dispatchEvent(
            new Event("everkeep:auth:logout")
        );

    };


    // =========================================================================
    // AUTH STATE
    // =========================================================================

    const isAuthenticated =
        Boolean(token);


    // =========================================================================
    // CONTEXT VALUE
    // =========================================================================

    const value = {

        user,

        token,

        loading,

        isAuthenticated,

        login,

        logout,

    };


    return (

        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>

    );
};


// ============================================================================
// USE AUTH HOOK
// ============================================================================

export const useAuth = () => {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );

    }


    return context;
};
