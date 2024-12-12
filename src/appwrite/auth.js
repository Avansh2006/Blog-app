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
            // Ensure `userId` is valid
            userId = this.validateUserId(userId);

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
            return await this.account.createSession(email, password); // Corrected method
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
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Error logging out:", error.message);
            throw error;
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

    // Correctly defined method to validate custom user IDs
    validateUserId(userId) {
        const isValid = userId.length <= 36 
            && /^[a-zA-Z0-9_.-]+$/.test(userId) 
            && !/^[^a-zA-Z0-9]/.test(userId);

        if (!isValid) {
            throw new Error(
                "Invalid userId: Must be at most 36 characters and only include a-z, A-Z, 0-9, _, ., and -. Cannot start with a special character."
            );
        }

        return userId;
    }
}

const authService = new AuthService();

export default authService;
