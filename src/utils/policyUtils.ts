
export const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "expired": return "bg-red-100 text-red-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const isRenewalDue = (expiryDate: string) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
};
