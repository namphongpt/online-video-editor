//import { ACCESS_TOKEN_KEY } from '@/constants/token.constant'
//import token from '@/lib/token'

import { Auth0ContextInterface } from '@auth0/auth0-react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

const convertDates = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string' && isoDateFormat.test(obj)) {
        return new Date(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(convertDates);
    } else if (typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = convertDates(obj[key]);
            return acc;
        }, {} as any);
    }

    return obj;
};

const createAuthenticatedClient = async (auth: Auth0ContextInterface): Promise<AxiosInstance> => {
    const token = await auth.getAccessTokenSilently();

    const client = axios.create({ headers: { Authorization: `Bearer ${token}` } });

    // Turn all datetime strings into a `Date` automatically.
    client.interceptors.response.use(
        (response: AxiosResponse) => {
            response.data = convertDates(response.data);
            return response;
        },
        (error) => Promise.reject(error)
    );

    return client;
};

export default createAuthenticatedClient;
