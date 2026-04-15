const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// ✅ Centralized API
export const api = {
  auth: {
    register: `${REACT_APP_API_URL}/register`,
    login: `${REACT_APP_API_URL}/login`,
    googleLogin: `${REACT_APP_API_URL}/google`,
    profile: `${REACT_APP_API_URL}/profile`,
    forgotPassword: `${REACT_APP_API_URL}/forgot-password`,
    resetPassword: `${REACT_APP_API_URL}/reset-password`,
  },

  dashboard: {
    stats: `${REACT_APP_API_URL}/dashboard/stats`,
  },

  ledger: {
    create: `${REACT_APP_API_URL}/createledger`,
    getUserLedgers: (userId) => `${REACT_APP_API_URL}/userledgers/${userId}`,
    getLedgerDetails: (ledgerId, userId) =>
      `${REACT_APP_API_URL}/ledger/${ledgerId}/${userId}/details`,
  },

  expense: {
    addExpense: `${REACT_APP_API_URL}/addexpense`,
    getTransactions: (ledgerId) =>
      `${REACT_APP_API_URL}/ledger/${ledgerId}/transactions`,
  },

  activity: {
    getLedgerActivity: (ledgerId) =>
      `${REACT_APP_API_URL}/activity/ledger/${ledgerId}`,
  },

  chat: {
    getMessages: (ledgerId) =>
      `${REACT_APP_API_URL}/ledger/${ledgerId}/messages`,
  },

  settlement: {
    markPaid: `${REACT_APP_API_URL}/settlement/mark-paid`,
    pendingDetails: (userId) =>
      `${REACT_APP_API_URL}/settlement/pending-details/${userId}`,
    pendingTransactions: (userId) =>
      `${REACT_APP_API_URL}/settlement/pending-transaction/${userId}`,
  },
};