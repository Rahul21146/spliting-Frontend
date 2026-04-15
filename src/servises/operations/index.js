import { apiConnector } from "../apiConnecter";
import { api } from "../api";
import { loginSuccess, setToken, setLoading} from "../../slice/authSlice";
import { toast } from "react-toastify";

export function login(email, password, navigate) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));

      // ✅ SAME AS axios.post
      const response = await apiConnector(
        "POST",
        api.auth.login,
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response);

      // ✅ SAME TOKEN CHECK
      const token = response.data?.token;

      if (!token) {
        toast.error("Token missing from server!");
        return;
      }

      // ✅ SAME LOCAL STORAGE
      localStorage.setItem("userToken", token);

      // ✅ OPTIONAL (if you want Redux state)
      dispatch(setToken(token));
      dispatch(loginSuccess(response.user || null));

      // ✅ SAME SUCCESS FLOW
      toast.success("Login Successful!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      toast.error(
        error?.message || "Invalid email or password!"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}


export function loginWithGoogle(googleToken,navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try{
      const response = await apiConnector(
        "POST",
        api.auth.googleLogin,
        { token: googleToken },
        { headers: { "Content-Type": "application/json" }}
      );

      const token = response.data?.token;

      if (!token) {
        toast.error("Google login failed!");
        return;
      } 
      localStorage.setItem("userToken", token);
      dispatch(setToken(token));
      toast.success("Google Login Successful!");
      navigate("/dashboard");

    } catch(error){
      console.error("Google Login Error:", error);
      toast.error(
        error?.message || "Google sign-in failed!"
      );
    } finally {
      dispatch(setLoading(false));
    }

  }
}

export function forgotPasswordLink(email,setEmail) {
  return async (dispatch) => {
    console.log("Forgot Password Action Triggered with email:", email);
    try{
     dispatch(setLoading(true));

     const response= await apiConnector(
      "POST",
      api.auth.forgotPassword,
      {email}
     )
      if(response.data.success){
        toast.success("Reset link sent to your email");
        setEmail("");
      }
  }
  catch(error){
    console.error("Forgot Password Error:", error);
    toast.error(
      error?.message || "Failed to send reset link!"
    );
  }
  dispatch(setLoading(false));
  }
}

export function signup(formData, navigate) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));

      // Prepare form data
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // API Request
      const response = await apiConnector(
        "POST",
        api.auth.register,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Signup Response:", response.data);
      toast.success("Account created successfully!");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.message || "Registration failed!");
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getUserLedgers(userId) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.ledger.getUserLedgers(userId),
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get User Ledgers Error:", error);
      toast.error("Failed to fetch ledgers");
      throw error;
    }
  };
}

export function createLedger(payload) {
  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        api.ledger.create,
        payload
      );
      toast.success("Ledger created successfully!");
      return response.data;
    } catch (error) {
      console.error("Create Ledger Error:", error);
      toast.error(error?.response?.data?.error || "Failed to create ledger");
      throw error;
    }
  };
}

export function markPaid(payload) {
  return async () => {
    try {
      await apiConnector(
        "POST",
        api.settlement.markPaid,
        payload
      );
      alert("Marked as Paid. Waiting for confirmation.");
    } catch (error) {
      console.error("Mark Paid Error:", error);
      alert("Error marking as paid");
      throw error;
    }
  };
}

export function resetPassword(email, password, newPassword, navigate) {
  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        api.auth.resetPassword,
        {
          email,
          password,
          newPassword,
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(response.data.message || "Reset failed");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error(error?.response?.data?.message || "Server error");
    }
  };
}

export function getLedgerDetails(ledgerId, userId) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.ledger.getLedgerDetails(ledgerId, userId),
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Ledger Details Error:", error);
      toast.error("Failed to fetch ledger details");
      throw error;
    }
  };
}

export function getTransactions(ledgerId) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.expense.getTransactions(ledgerId),
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Transactions Error:", error);
      toast.error("Failed to fetch transactions");
      throw error;
    }
  };
}

export function getActivity(ledgerId) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.activity.getLedgerActivity(ledgerId),
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Activity Error:", error);
      toast.error("Failed to fetch activity");
      throw error;
    }
  };
}

export function addExpense(payload) {
  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        api.expense.addExpense,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      toast.success("Expense added successfully!");
      return response.data;
    } catch (error) {
      console.error("Add Expense Error:", error);
      toast.error("Failed to add expense");
      throw error;
    }
  };
}

export function getMessages(ledgerId) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.chat.getMessages(ledgerId),
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Messages Error:", error);
      toast.error("Failed to fetch messages");
      throw error;
    }
  };
}

export function getProfile(userToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.auth.profile,
        null,
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Profile Error:", error);
      toast.error("Failed to fetch profile");
      throw error;
    }
  };
}

export function getDashboardStats() {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.dashboard.stats
      );
      return response.data;
    } catch (error) {
      console.error("Get Dashboard Stats Error:", error);
      toast.error("Failed to fetch dashboard stats");
      throw error;
    }
  };
}

export function getPendingDetails(userId) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.settlement.pendingDetails(userId),
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Pending Details Error:", error);
      toast.error("Failed to fetch pending details");
      throw error;
    }
  };
}

export function getPendingTransactions(userId) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET",
        api.settlement.pendingTransactions(userId),
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Get Pending Transactions Error:", error);
      toast.error("Failed to fetch pending transactions");
      throw error;
    }
  };
}


