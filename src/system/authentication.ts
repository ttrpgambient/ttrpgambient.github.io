import { DROPBOX_APP } from "./dropbox/dropbox_common";
import { Dropbox } from "./dropbox/dropbox";

import { appGlobals } from "./appGlobals";

export const SYSTEM_NAME = 'auth_system';
const ACCESS_TOKEN = 'auth_access_token';
const REFRESH_TOKEN = 'auth_refresh_token';

class Authentication {

    getSystemName(): string | null {
        return window.localStorage.getItem(SYSTEM_NAME);
    }

    private getAccessToken(): string | null {
        return window.localStorage.getItem(ACCESS_TOKEN);
    }

    private getRefreshToken(): string | null {
        return window.localStorage.getItem(REFRESH_TOKEN);
    }

    private credentialsExist(): boolean {
        return this.getAccessToken() != null && this.getRefreshToken() != null;
    }

    async logout(): Promise<void> {
        await appGlobals.system?.getAuth().Logout();
        window.localStorage.removeItem(SYSTEM_NAME);
        window.localStorage.removeItem(ACCESS_TOKEN);
        window.localStorage.removeItem(REFRESH_TOKEN);
    }

    async tryAuthentication(): Promise<boolean> {
        const systemName = this.getSystemName();
        if ( !!systemName ) {
            const accessToken = this.getAccessToken();
            const refreshToken = this.getRefreshToken();
            if (!!accessToken && !!refreshToken) {
                switch (systemName) {
                    case DROPBOX_APP:
                        if (appGlobals.system == null) appGlobals.system = new Dropbox();

                        await appGlobals.system.getAuth().Login(accessToken, refreshToken);
                        return true;
                    default:
                        throw Error('Unknown ' + SYSTEM_NAME + ': ' + systemName);
                }
            } else { // check if there is code in URL, user logged in
                const queryString = window.location.search; // Returns:'?q=123'// params.get('q') is the number 123
                const params = new URLSearchParams(queryString);
                const oauth_code = params.get('code');
                const state = params.get('state');
                window.history.pushState('Remove code from oauth', 'TTRPGAmbient', '/');
                if (!!oauth_code) {
                    switch (state) {
                        case DROPBOX_APP:
                            if (appGlobals.system == null) appGlobals.system = new Dropbox();
                            
                            let tokens = await appGlobals.system.getAuth().GetOAuthAccessToken(oauth_code);
                            window.localStorage.setItem(ACCESS_TOKEN, tokens.access_token as string);
                            window.localStorage.setItem(REFRESH_TOKEN, tokens.refresh_token as string);
                            await appGlobals.system.getAuth().Login(
                                tokens.access_token as string,
                                tokens.refresh_token as string
                            );
                            return true;
                        default:
                            throw Error('Uknown login app');
                    }
                }
            }
        }

        return false;
    }

}

export const authGlobal = new Authentication();