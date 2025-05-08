import { useState, useEffect } from 'react';

export default function useCurrencyConverter() {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  
  // Fetch exchange rates from the API
  const fetchRates = async (base = 'USD') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch exchange rates: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result === 'error') {
        throw new Error(data['error-type'] || 'Unknown API error');
      }
      
      setRates(data.rates || {});
      setBaseCurrency(data.base_code);
      setLastUpdated(data.time_last_update_utc);
      setAvailableCurrencies(Object.keys(data.rates || {}));
      
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch rates on component mount
  useEffect(() => {
    // Check localStorage for cached rates to avoid hitting rate limits
    const cachedData = localStorage.getItem('exchangeRates');
    const cacheTime = localStorage.getItem('exchangeRatesTime');
    
    // Use cached data if it's less than 24 hours old
    if (cachedData && cacheTime) {
      const cachedAge = Date.now() - parseInt(cacheTime);
      const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (cachedAge < ONE_DAY) {
        const data = JSON.parse(cachedData);
        setRates(data.rates || {});
        setBaseCurrency(data.base_code);
        setLastUpdated(data.time_last_update_utc);
        setAvailableCurrencies(Object.keys(data.rates || {}));
        setLoading(false);
        return;
      }
    }
    
    fetchRates();
  }, []);
  
  // Save rates to localStorage when they change
  useEffect(() => {
    if (!loading && !error && Object.keys(rates).length > 0) {
      localStorage.setItem('exchangeRates', JSON.stringify({
        rates,
        base_code: baseCurrency,
        time_last_update_utc: lastUpdated
      }));
      localStorage.setItem('exchangeRatesTime', Date.now().toString());
    }
  }, [rates, baseCurrency, loading, error, lastUpdated]);
  
  // Function to convert amounts between currencies
  const convertCurrency = (amount, from = 'USD', to) => {
    if (!to || !rates[to] || !rates[from]) {
      return amount;
    }
    
    // Convert from the source currency to 1 unit of base currency
    const amountInBaseCurrency = amount / rates[from];
    
    // Convert from base currency to target currency
    return amountInBaseCurrency * rates[to];
  };
  
  // Change the base currency
  const changeBaseCurrency = (newBase) => {
    if (newBase !== baseCurrency) {
      fetchRates(newBase);
    }
  };
  
  return {
    rates,
    baseCurrency,
    loading,
    error,
    lastUpdated,
    availableCurrencies,
    convertCurrency,
    changeBaseCurrency,
    refreshRates: () => fetchRates(baseCurrency)
  };
}