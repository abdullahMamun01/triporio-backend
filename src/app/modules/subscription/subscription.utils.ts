


export const calculateEndDate = (subscriptionType: 'monthly' | 'yearly'): Date => {
    const startDate = new Date();
    let endDate: Date;
  
    if (subscriptionType === 'monthly') {
      endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
    } else { // yearly
      endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    }
  
    return endDate;
  };