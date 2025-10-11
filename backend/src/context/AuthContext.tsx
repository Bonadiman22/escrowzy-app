import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { User, LogIn, LogOut, UserPlus, Home, Loader } from 'lucide-react';

// --- CONFIGURAÇÃO FIREBASE (Apenas Boilerplate para aderir às regras do ambiente) ---
// O sistema de Auth real neste arquivo é o mockContext, mas a inicialização é mantida.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;

// --- DADOS DE SIMULAÇÃO E CLIENTE MOCK API ---

/**
 * @typedef {{id: string, name: string, email: string}} User
 * @typedef {{user: User | null, token: string | null}} AuthData
 */

/** @type {AuthData | null} */
let mockAuthData = null; // Simula o armazenamento persistente do token/usuário

/**
 * Simula um cliente API para Login/Registro/Perfil.
 * Utiliza promessas para imitar chamadas assíncronas reais.
 */
const mockApi = {
    /**
     * @param {string} endpoint
     * @param {object} [data]
     * @returns {Promise<{data: any}>}
     */
    post: (endpoint, data) => new Promise((resolve, reject) => {
        setTimeout(() => { // Simula atraso de rede
            if (endpoint === "/auth/login") {
                if (data.email === "teste@exemplo.com" && data.password === "123456") {
                    const user = { id: 'u123', name: "Usuário Teste", email: data.email };
                    mockAuthData = { user, token: 'mock-jwt-token-123' };
                    resolve({ data: mockAuthData });
                } else {
                    reject({ message: "Credenciais inválidas." });
                }
            } else if (endpoint === "/auth/register") {
                // Simulação de registro bem-sucedido
                resolve({ data: { message: "Registro bem-sucedido" } });
            } else {
                reject({ message: "Endpoint não encontrado." });
            }
        }, 1000);
    }),

    /**
     * @param {string} endpoint
     * @returns {Promise<{data: any}>}
     */
    get: (endpoint) => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (endpoint === "/auth/profile") {
                if (mockAuthData && mockAuthData.token) {
                    resolve({ data: { user: mockAuthData.user } });
                } else {
                    reject({ message: "Token inválido ou inexistente." });
                }
            } else {
                reject({ message: "Endpoint não encontrado." });
            }
        }, 500);
    }),
};

// --- AUTH CONTEXT E PROVIDER (Baseado no snippet do usuário) ---

/**
 * @typedef {object} AuthContextType
 * @property {User | null} user
 * @property {(email: string, password: string) => Promise<void>} login
 * @property {(name: string, cpf: string, email: string, password: string) => Promise<void>} register
 * @property {() => void} logout
 */

/** @type {React.Context<AuthContextType>} */
export const AuthContext = createContext(null);

/**
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
    /** @type {[User | null, React.Dispatch<React.SetStateAction<User | null>>]} */
    const [user, setUser] = useState(null);
    /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
    const [token, setToken] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [appUserId, setAppUserId] = useState(null); // Para o ID do ambiente Firebase

    // 1. Inicialização do ambiente (Obter ID do ambiente)
    useEffect(() => {
        if (!auth) {
            setAppUserId(`anon-${crypto.randomUUID().substring(0, 8)}`);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                setAppUserId(fbUser.uid);
            } else {
                try {
                    if (initialAuthToken) {
                        const credential = await signInWithCustomToken(auth, initialAuthToken);
                        setAppUserId(credential.user.uid);
                    } else {
                        const credential = await signInAnonymously(auth);
                        setAppUserId(credential.user.uid);
                    }
                } catch (e) {
                    console.error("Erro ao autenticar no Firebase:", e);
                    setAppUserId(`error-${crypto.randomUUID().substring(0, 8)}`);
                }
            }
        });
        return () => unsubscribe();
    }, []);


    // 2. Simular a recuperação do usuário logado (usando mockAuthData na inicialização)
    useEffect(() => {
        // Na prática, você carregaria o token do armazenamento persistente aqui.
        if (mockAuthData && mockAuthData.token) {
             loadProfile();
        }
        setIsLoaded(true);
    }, []);

    const loadProfile = async () => {
        try {
            const { data } = await mockApi.get("/auth/profile");
            setUser(data.user);
            setToken(mockAuthData.token);
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            logout();
        }
    };

    /**
     * @param {string} email
     * @param {string} password
     */
    const login = async (email, password) => {
        const { data } = await mockApi.post("/auth/login", { email, password });
        // Simula o armazenamento do token e do usuário na memória
        setToken(data.token);
        setUser(data.user);
    };

    /**
     * @param {string} name
     * @param {string} cpf
     * @param {string} email
     * @param {string} password
     */
    const register = async (name, cpf, email, password) => {
        await mockApi.post("/auth/register", { name, cpf, email, password });
    };

    const logout = () => {
        // Simula a remoção do token e do usuário
        mockAuthData = null; // Limpa o mock "armazenamento"
        setToken(null);
        setUser(null);
    };

    // Valor do Contexto
    const contextValue = { user, login, register, logout };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- COMPONENTES DE DEMONSTRAÇÃO DE UI ---

/**
 * Componente para mostrar o estado de autenticação.
 */
const AuthStatus = () => {
    /** @type {AuthContextType} */
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="flex flex-col items-center p-6 bg-blue-50 dark:bg-gray-800 border-2 border-dashed border-blue-200 dark:border-gray-700 rounded-xl shadow-inner w-full">
            <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400 flex items-center">
                <User className="w-5 h-5 mr-2" /> Estado Atual
            </h3>
            {user ? (
                <div className="text-center">
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">({user.email})</p>
                    <button
                        onClick={logout}
                        className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full shadow-md transition duration-200"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Sair
                    </button>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 italic">
                    Não autenticado. Por favor, inicie sessão ou registe-se.
                </p>
            )}
        </div>
    );
};

/**
 * Formulário de Login.
 */
const LoginForm = () => {
    /** @type {AuthContextType} */
    const { login, user } = useContext(AuthContext);
    const [email, setEmail] = useState("teste@exemplo.com");
    const [password, setPassword] = useState("123456");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || "Erro desconhecido ao iniciar sessão.");
        } finally {
            setLoading(false);
        }
    };

    if (user) return null; // Não mostra o formulário se o usuário estiver logado

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg space-y-4 border border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-semibold text-teal-600 dark:text-teal-400 flex items-center">
                <LogIn className="w-6 h-6 mr-2" /> Iniciar Sessão
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Use: **teste@exemplo.com** / **123456**
            </p>
            <Input
                id="login-email"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                id="login-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full shadow-lg transition duration-200 disabled:bg-gray-400"
            >
                {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                {loading ? "A processar..." : "Entrar"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
    );
};

/**
 * Formulário de Registo.
 */
const RegisterForm = () => {
    /** @type {AuthContextType} */
    const { register, user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await register(name, cpf, email, password);
            setMessage("Registo simulado com sucesso! Pode iniciar sessão agora.");
            setName(''); setEmail(''); setCpf(''); setPassword('');
        } catch (err) {
            setMessage(`Erro: ${err.message || "Erro ao registar."}`);
        } finally {
            setLoading(false);
        }
    };

    if (user) return null; // Não mostra o formulário se o usuário estiver logado

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg space-y-4 border border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 flex items-center">
                <UserPlus className="w-6 h-6 mr-2" /> Registo
            </h3>
            <Input
                id="register-name"
                label="Nome"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <Input
                id="register-cpf"
                label="CPF"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
            />
            <Input
                id="register-email"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input
                id="register-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-full shadow-lg transition duration-200 disabled:bg-gray-400"
            >
                {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                {loading ? "A registar..." : "Registar"}
            </button>
            {message && <p className={`text-sm mt-2 ${message.startsWith('Erro') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        </form>
    );
};

// Componente utilitário de Input
const Input = ({ id, label, type, value, onChange, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />
    </div>
);

/**
 * Componente principal da aplicação (App).
 */
const App = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-200">
            <header className="w-full p-4 bg-blue-900 shadow-lg flex justify-center items-center">
                <h1 className="text-2xl font-bold text-blue-400 flex items-center">
                    <Home className="mr-2 h-6 w-6"/> Demo de Autenticação
                </h1>
            </header>

            <AuthProvider>
                <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
                    <div className="mb-8">
                        <AuthStatus />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <LoginForm />
                        <RegisterForm />
                    </div>
                    <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300">
                        <p className="font-semibold">Nota de Simulação:</p>
                        <ul className="list-disc list-inside text-sm mt-1">
                            <li>O `mockApi` simula as chamadas de rede.</li>
                            <li>Credenciais para Login: **teste@exemplo.com** / **123456**.</li>
                            <li>O token e o perfil do usuário são armazenados **apenas na memória** do aplicativo e serão perdidos ao recarregar a página, em conformidade com as restrições do ambiente.</li>
                        </ul>
                    </div>
                </main>
            </AuthProvider>
        </div>
    );
};

export default App;