import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

async createAccount({ email, password, name, userId = ID.unique() }) {
    try {
        

        const userAccount = await this.account.create(userId, email, password, name);
        if (userAccount) {
            return this.login({ email, password });
        } else {
            return userAccount;
        }
    } catch (error) {
        console.error("Error creating account:", error.message);
        throw error;
    }
}



    async login({ email, password }) {
        try {
            return await this.account.createSession(email, password); // Updated method
        } catch (error) {
            console.error("Error logging in:", error.message);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Error retrieving current user:", error.message);
            throw error; // Or return null for a fallback
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Error logging out:", error.message);
            throw error; // Optional
        }
    }

    async allowGuestAccess() {
        try {
            return await this.account.createAnonymousSession();
        } catch (error) {
            console.error("Error creating guest session:", error.message);
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;
