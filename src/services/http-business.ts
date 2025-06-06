/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig } from 'axios';
import { getStorageValue } from '../hooks/useLocalStorage.ts';

// https://roktune.duckdns.org/
// process.env.REACT_APP_API_URL

const axiosInstance = axios.create({
	baseURL: 'https://roktune.duckdns.org/',
	headers: {
		'Content-type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
	(config: any) => {
		const accessToken = getStorageValue('accessToken', null);
		if (accessToken) {
			if (config.headers)
				config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		if (response.data) {
			if (response.data.accessToken) {
				axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
			}
		}
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response;
	},
	(error) => {
		if (error.request.responseURL.includes('signin')) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401) {
			localStorage.removeItem('accessToken');
			// window.location.replace('/');
		}
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	}
);

export default axiosInstance;