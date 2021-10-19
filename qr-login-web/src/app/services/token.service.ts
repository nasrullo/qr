import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

export interface TokenPack {
    id: string;
    issued_at: number;
    expired_at: number;
}

@Injectable()
export class TokenService {

    private key = 'token';

    /**
     * Sets a token into the storage. This method is used by the AuthService automatically.
     */
    setToken(data: string): Observable<null> {
        if (!data) {
            return of(null);
        }
        localStorage.setItem(this.key, `${data}`);
        return of(null);
    }

    /**
     * Returns observable of current token
     */
    getToken(): Observable<string | null> {
        const token = localStorage.getItem(this.key);
        return of(token);
    }

    /**
     * Clears token from localStorage
     */
    clear(): void {
        localStorage.removeItem(this.key);
    }

    /**
     * Is data expired
     */
    isValid(data: string): boolean {
        if (!data) {
            return false;
        }
        try {
            const token = data;
            const tokenPack: TokenPack = decodeJwtPayload(token);
            const expDate = new Date(tokenPack.expired_at * 1000);
            return new Date() < expDate;
        } catch (e) {
            return false;
        }
    }
}

function decodeJwtPayload(payload: string): TokenPack {

    if (payload.length === 0) {
        throw new Error('Cannot extract from an empty payload.');
    }

    const parts = payload.split('.');

    if (parts.length !== 3) {
        throw new Error(`The payload ${payload} is not valid JWT payload and must consist of three parts.`);
    }

    let decoded;
    try {
        decoded = urlBase64Decode(parts[1]);
    } catch (e) {
        throw new Error(`The payload ${payload} is not valid JWT payload and cannot be parsed.`);
    }

    if (!decoded) {
        throw new Error(`The payload ${payload} is not valid JWT payload and cannot be decoded.`);
    }
    return JSON.parse(decoded);
}

function urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: {
            break;
        }
        case 2: {
            output += '==';
            break;
        }
        case 3: {
            output += '=';
            break;
        }
        default: {
            throw new Error('Illegal base64url string!');
        }
    }
    return b64DecodeUnicode(output);
}

function b64DecodeUnicode(str: string): string {
    return decodeURIComponent(Array.prototype.map.call(b64decode(str), (c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function b64decode(str: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
        throw new Error(`'atob' failed: The string to be decoded is not correctly encoded.`);
    }
    /* tslint:disable */
    for (
        // initialize result and counters
        let bc = 0, bs: any, buffer: any, idx = 0;
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    /* tslint:enable */
    return output;
}
