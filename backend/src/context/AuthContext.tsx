import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User as FBUser } from 'firebase/auth';
import { User, LogIn, LogOut, UserPlus, Home, Loader } from 'lucide-react';


 export interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthData {
    user: User | null;
    token: string | null;
}       

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, cpf: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// --- CONFIGURAÇÃO FIREBASE (Apenas Boilerplate para aderir às regras do ambiente) -
// Tipagem para constantes globais
declare const __app_id: string | undefined; 
declare const __firebase_config: string | undefined; // JSON string
declare const __initial_auth_token: string | null | undefined;  

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken: string |null = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;

// --- DADOS DE SIMULAÇÃO E CLIENTE MOCK API ---
let mockAuthData: AuthData | null = null; // Simula o "armazenamento" do token e do usuário

const mockApi = {
      post: (endpoint, data?: any) : Promise<{data: any}> => new Promise((resolve, reject) => {
        setTimeout(() => { 
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

    
    get: (endpoint : string): Promise<{data:{user: User}}> => new Promise((resolve, reject) => {
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

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<Boolean>|(false);
    const [appUserId, setAppUserId] = useState<string| null>(null); // Para o ID do ambiente Firebase

    // 1. Inicialização do ambiente (Obter ID do ambiente)
    useEffect(() => {
        if (!auth) {
            setAppUserId(`anon-${crypto.randomUUID().substring(0, 8)}`);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (fbUser : FBUser | null) => {
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

    const loadProfile = async (): Promise<void>=> {
        try {
            const { data } = await mockApi.get("/auth/profile");
            setUser(data.user);
            setToken(mockAuthData.token);
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            logout();
        }
    };
    const login = async (email:string , password:string): Promise<void> => {
        const { data } = await mockApi.post("/auth/login", { email, password });
        // Simula o armazenamento do token e do usuário na memória
        setToken(data.token);
        setUser(data.user);
    };
    const register = async (name:string, cpf:string, email:string, password:string): Promise<void> => {
        await mockApi.post("/auth/register", { name, cpf, email, password });
    };

    const logout = (): void => {
        // Simula a remoção do token e do usuário
        mockAuthData = null; // Limpa o mock "armazenamento"
        setToken(null);
        setUser(null);
    };

    // Valor do Contexto
    const contextValue = { user,isLoaded, login, register, logout };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
 interface InputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
} 

const Input: React.FC<InputProps> = ({ id, label, type, value, onChange, required }) => (
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

const AuthStatus: React.FC = () => {
    const { user, logout } = useAuth();

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

//Formulário de Login.

export const LoginForm: React.FC = () => {
    const { login, user } = useAuth();
    const [email, setEmail] = useState("teste@exemplo.com");
    const [password, setPassword] = useState("123456");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
        } catch (err: any) {
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
export const RegisterForm: React.FC = () => {
    const { register, user } = useAuth();
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