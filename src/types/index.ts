export interface WebsiteConfig {
    // General Settings
    title: string;
    serverName: string;
    tagline: string;
    description: string;
    
    // Server Settings
    serverIP: string;
    serverPort: number;
    
    // Theme Settings
    primaryColor: string;
    primaryDark: string;
    primaryLight: string;
    darkColor: string;
    lightColor: string;
    accentColor: string;
    
    // Links
    discordInvite: string;
    
    // Content
    footerTrademark: string;
    copyrightText: string;
}