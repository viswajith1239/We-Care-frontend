export const formatPriceToINR = (amount: string | number) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
    if (isNaN(numericAmount)) {
      return 'Invalid Amount'; 
    }
  
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(numericAmount);
  };