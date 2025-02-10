import { useState, useEffect } from "react";

// Lista de países asignados a cada divisa
const countryCurrencyMap = {
    AED: "Emiratos Árabes Unidos",
    AFN: "Afganistán",
    ALL: "Albania",
    AMD: "Armenia",
    ARS: "Argentina",
    AUD: "Australia",
    BBD: "Barbados",
    BDT: "Bangladés",
    BGN: "Bulgaria",
    BHD: "Baréin",
    BRL: "Brasil",
    CAD: "Canadá",
    CHF: "Suiza",
    CLP: "Chile",
    CNY: "China",
    COP: "Colombia",
    CRC: "Costa Rica",
    CZK: "República Checa",
    DKK: "Dinamarca",
    DOP: "República Dominicana",
    EGP: "Egipto",
    EUR: "España, Portugal",
    GBP: "Reino Unido",
    HKD: "Hong Kong",
    HUF: "Hungría",
    IDR: "Indonesia",
    ILS: "Israel",
    INR: "India",
    JMD: "Jamaica",
    JPY: "Japón",
    KRW: "Corea del Sur",
    MXN: "México",
    MYR: "Malasia",
    NOK: "Noruega",
    NZD: "Nueva Zelanda",
    PAB: "Panamá",
    PEN: "Perú",
    PHP: "Filipinas",
    PKR: "Pakistán",
    PLN: "Polonia",
    RUB: "Rusia",
    SAR: "Arabia Saudita",
    SEK: "Suecia",
    SGD: "Singapur",
    THB: "Tailandia",
    TRY: "Turquía",
    TWD: "Taiwán",
    USD: "Estados Unidos",
    ZAR: "Sudáfrica",
};

// Lista de países permitidos según tu requerimiento
const allowedCountries = [
    "España, Portugal",
    "Estados Unidos",
    "Colombia",
    "Costa Rica",
    "Chile",
    "Jamaica",
    "México",
    "Panamá",
    "Perú"
];

// COMPONENTE DE LOGIN
function Login({ onLogin }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        const validUser = "admin";
        const validPassword = "1234";

        if (user === validUser && password === validPassword) {
            localStorage.setItem("isLoggedIn", "true"); // Guarda sesión en localStorage
            onLogin(true);
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Iniciar Sesión</h2>
            <input type="text" placeholder="Usuario" onChange={(e) => setUser(e.target.value)} style={styles.input} />
            <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            <button onClick={handleLogin} style={styles.button}>Entrar</button>
        </div>
    );
}

// COMPONENTE PRINCIPAL CONVERSOR DE DIVISAS
function Home({ onLogout }) {
    const [rates, setRates] = useState({});
    const [base, setBase] = useState("USD");
    const [loading, setLoading] = useState(true);
    const [filterAllowed, setFilterAllowed] = useState(false);

    useEffect(() => {
        fetch(`https://v6.exchangerate-api.com/v6/29aeb59585609d944e534f49/latest/${base}`)
            .then((response) => response.json())
            .then((data) => {
                setRates(data.conversion_rates);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [base]);

    const sortedRates = Object.entries(rates)
        .map(([currency, value]) => ({
            currency,
            country: countryCurrencyMap[currency] || "Otro País",
            value,
        }))
        .sort((a, b) => a.currency.localeCompare(b.currency));

    const filteredRates = filterAllowed
        ? sortedRates.filter(({ country }) => allowedCountries.includes(country))
        : sortedRates;

    return (
        <div style={styles.container}>
            <h1>Conversor de Divisas</h1>

            <label>
                Moneda base:
                <select value={base} onChange={(e) => setBase(e.target.value)}>
                    <option value="USD">Dólar (USD)</option>
                    <option value="MXN">Peso Mexicano (MXN)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">Libra (GBP)</option>
                </select>
            </label>

            <div style={{ marginTop: "10px" }}>
                <input type="checkbox" checked={filterAllowed} onChange={() => setFilterAllowed(!filterAllowed)} />
                <label> Mostrar solo países donde está la empresa</label>
            </div>

            <button onClick={onLogout} style={styles.button}>Cerrar Sesión</button>

            {loading ? <p>Cargando...</p> : (
                <div style={{ overflowX: "auto", maxWidth: "80%" }}>
                    <table border="1" style={{ margin: "20px auto", width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Moneda</th>
                                <th>País</th>
                                <th>Tipo de Cambio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRates.map(({ currency, country, value }) => (
                                <tr key={currency}>
                                    <td>{currency}</td>
                                    <td>{country}</td>
                                    <td>{value.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// COMPONENTE PRINCIPAL QUE MANEJA LOGIN
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") === "true") {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
    };

    return (
        <div>
            {isLoggedIn ? <Home onLogout={handleLogout} /> : <Login onLogin={setIsLoggedIn} />}
        </div>
    );
}

// ESTILOS CSS EN OBJETO
const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px",
    },
    input: {
        display: "block",
        margin: "10px auto",
        padding: "10px",
        fontSize: "16px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        marginTop: "10px",
    },
};
