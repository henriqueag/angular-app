export interface SmartViewAuthToken {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
    expires_at?: number;
}
