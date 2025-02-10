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

function App() {
    const [rates, setRates] = useState({});
    const [base, setBase] = useState("USD");
    const [loading, setLoading] = useState(true);
    const [filterAllowed, setFilterAllowed] = useState(false); // Estado del checkbox

    useEffect(() => {
        fetch(`https://v6.exchangerate-api.com/v6/29aeb59585609d944e534f49/latest/${base}`)
            .then((response) => response.json())
            .then((data) => {
                setRates(data.conversion_rates);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [base]);

    // Convertimos el objeto en una lista y la ordenamos por código de moneda
    const sortedRates = Object.entries(rates)
        .map(([currency, value]) => ({
            currency,
            country: countryCurrencyMap[currency] || "Otro País", // Si no está en la lista, pone "Otro País"
            value,
        }))
        .sort((a, b) => a.currency.localeCompare(b.currency)); // Ordenar por código de moneda

    // Filtrar los datos si el checkbox está activado (solo mostrar los países permitidos)
    const filteredRates = filterAllowed
        ? sortedRates.filter(({ country }) => allowedCountries.includes(country))
        : sortedRates;

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            textAlign: "center",
            overflowY: "auto",
            padding: "20px"
        }}>
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

            {/* Checkbox para mostrar/ocultar países fuera de la lista */}
            <div style={{ marginTop: "10px" }}>
                <input
                    type="checkbox"
                    checked={filterAllowed}
                    onChange={() => setFilterAllowed(!filterAllowed)}
                />
                <label> Mostrar solo países donde esta la empresa</label>
            </div>

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

export default App;
