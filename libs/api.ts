import { AxiosApiClient } from "@/services/implementations/AxiosApiClient";
import { notificationService } from "@/services/implementations/ToastNotificationService";
import { redirect } from "next/navigation";
import config from "@/config";

// Create the client service
const apiService = new AxiosApiClient("/api");

// Access the underlying axios instance to add application-specific interceptors
// We do this here to keep the core AxiosApiClient generic and reusable
const axiosInstance = apiService.axiosInstance;

axiosInstance.interceptors.response.use(
  (response) => response, // Success is already handled by AxiosApiClient (extracts data)
  (error) => {
    let message = "";

    if (error.response?.status === 401) {
      // User not auth, ask to re login
      notificationService.error("Please login");
      // Sends the user to the login page
      redirect(config.auth.loginUrl);
    } else if (error.response?.status === 403) {
      // User not authorized
      message = "Pick a plan to use this feature";
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    message = typeof message === "string" ? message : JSON.stringify(message);

    console.error(message);

    // Automatically display errors to the user
    if (message) {
      notificationService.error(message);
    } else {
      notificationService.error("something went wrong...");
    }
    return Promise.reject(error);
  }
);

export default apiService;
