import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Copy, Check, ChevronUp, CalendarRange, Cpu, SquareCode, CircleDollarSign, DollarSign, Timer, RefreshCw } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateTotals } from '../../utils/calculate';
import useCurrencyConverter from '../../hooks/useCurrencyConverter';

export default function Summary() {
  const project = useSelector(state => state.project);
  const config = useSelector((state) => state.config);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showConverted, setShowConverted] = useState(false);
  
  const { 
    rates, 
    loading, 
    error, 
    availableCurrencies, 
    convertCurrency,
    lastUpdated
  } = useCurrencyConverter();

  const totals = calculateTotals(project, config);
  
  // Get popular currencies at the top of the list
  const popularCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'];
  const sortedCurrencies = [...availableCurrencies].sort((a, b) => {
    // Put popular currencies first, then alphabetically
    const aPopIndex = popularCurrencies.indexOf(a);
    const bPopIndex = popularCurrencies.indexOf(b);
    
    if (aPopIndex >= 0 && bPopIndex >= 0) return aPopIndex - bPopIndex;
    if (aPopIndex >= 0) return -1;
    if (bPopIndex >= 0) return 1;
    return a.localeCompare(b);
  });

  // Format the currency with the appropriate symbol
  const formatCurrency = (amount, currencyCode) => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    try {
      return formatter.format(amount);
    } catch (e) {
      // Fallback if the currency code is not supported
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  };
  
  // Convert and format the amount
  const getFormattedAmount = (amount) => {
    if (!showConverted || selectedCurrency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    
    const convertedAmount = convertCurrency(amount, 'USD', selectedCurrency);
    return formatCurrency(convertedAmount, selectedCurrency);
  };
  
  // Toggle currency conversion
  const toggleCurrencyConversion = () => {
    setShowConverted(!showConverted);
  };
  
  return (  
    <div className="fixed bottom-0 z-20">

      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>

        <DrawerTrigger asChild className="dark:bg-gray-900 bg-slate-200 dark:text-white text-black bottom-0 mb-0 pb-0 h-auto rounded-t-full w-56 shadow-2xl ">
          <div className='h-full flex flex-col items-center justify-center'>
            <ChevronUp size={16} />
            <small>Summary</small>
          </div>
        </DrawerTrigger>

        <DrawerContent className="p-3 gap-2">
          <DialogTitle>Project Summary</DialogTitle>
          <DialogDescription>
            The project will cost {getFormattedAmount(totals.projectCost)} in total and will take {totals.days.toFixed(0)} days to complete.
          </DialogDescription>
          
          
          {/* Attribution link as required by the API */}
          <small className="text-gray-500 text-xs mb-2">
            <a href="https://www.exchangerate-api.com" className="underline">Rates By Exchange Rate API</a>
          </small>
          
          <div className="flex flex-col gap-4 my-12">
            <div className="flex items-center">
              <SquareCode />
              <p className="ml-2">Total Labor Cost: {getFormattedAmount(totals.laborCost)}</p>
            </div>
            <div className="flex items-center">
              <Timer />
              <p className="ml-2">Total Hours of job: {totals.hours.toFixed(0)}</p>
            </div>

            <hr className='w-5/12 border-gray-400'/>

            <div className="flex items-center">
              <CalendarRange />
              <p className="ml-2">Total Days: {totals.days.toFixed(1)}</p>
            </div>
            <div className="flex items-center">
              <CalendarRange />
              <p className="ml-2">Total Months: {totals.months.toFixed(1)}</p>
            </div>
            <div className="flex items-center">
              <Cpu />
              <p className="ml-2">Total Tech Cost: {getFormattedAmount(totals.techCost)}</p>
            </div>
            <div className="flex items-center">
              <CircleDollarSign />
              <p className="ml-2">Total Monthly Cost: {getFormattedAmount(totals.monthlyCost)}</p>
            </div>
            <div className="flex items-center">
              <DollarSign />
              <p className="ml-2">Total Project Cost: {getFormattedAmount(totals.projectCost)}</p>
            </div>

            {/* Currency Converter UI */}
          <div className="flex items-center gap-2 my-2">
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              disabled={loading}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="USD">Loading...</SelectItem>
                ) : error ? (
                  <SelectItem value="USD">Error loading currencies</SelectItem>
                ) : (
                  sortedCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={toggleCurrencyConversion} 
              variant="outline" 
              size="sm"
              disabled={loading || error || selectedCurrency === 'USD'}
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} />
              {showConverted && selectedCurrency !== 'USD' ? selectedCurrency : 'USD'}
            </Button>
            
            {lastUpdated && (
              <small className="text-gray-500 text-xs">
                Rates: {new Date(lastUpdated).toLocaleDateString()}
              </small>
            )}
          </div>
          
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
