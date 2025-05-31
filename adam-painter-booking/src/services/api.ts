import axios from "axios";

const BASE_URL = "http://localhost:4000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

export const addAvailability = (startTime: string, endTime: string) => {
  return axios.post(
    `${BASE_URL}/availability`,
    { startTime, endTime },
    getAuthHeaders()
  );
};

export const getMyAvailability = () => {
  return axios.get(`${BASE_URL}/availability/me`, getAuthHeaders());
};

export const addBookingRequest = (startTime: string, endTime: string) => {
  return axios.post(
    `${BASE_URL}/bookings`,
    { startTime, endTime },
    getAuthHeaders()
  );
};

export const getMyBookings = () => {
  return axios.get(`${BASE_URL}/bookings/me`, getAuthHeaders());
};

export const deleteAvailability = async (id: string) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${BASE_URL}/availability/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteBooking = async (id: number) => {
  const token = localStorage.getItem("token");
  console.log(token);
  return axios.delete(`http://localhost:4000/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
