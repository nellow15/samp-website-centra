import { WebsiteConfig } from './types';

export const websiteConfig: WebsiteConfig = {
    // General Settings
    title: "Centra Roleplay",
    serverName: "CENTRA ROLEPLAY",
    tagline: "SAN ANDREAS MULTIPLAYER SERVER",
    description: "Official Centra Roleplay San Andreas Multiplayer Server",
    
    // Server Settings
    serverIP: "play.shardox.web.id",
    serverPort: 7777,
    
    // Theme Settings
    primaryColor: "#ff3d00",
    primaryDark: "#d32f00",
    primaryLight: "#ff7539",
    darkColor: "#0a0a0a",
    lightColor: "#ffffff",
    accentColor: "#ff9e80",
    
    // Links
    discordInvite: "https://discord.gg/t9RR3JDagR",
    
    // Content
    footerTrademark: "CENTRA ROLEPLAY IS A REGISTERED TRADEMARK OF TAKE-TWO INTERACTIVE SOFTWARE. THIS SERVER IS NOT AFFILIATED WITH OR ENDORSED BY TAKE-TWO INTERACTIVE SOFTWARE.",
    copyrightText: "ALL RIGHTS RESERVED | CENTRA ROLEPLAY"
};

// Helper function to adjust color brightness
export function adjustColor(color: string, amount: number): string {
    let usePound = false;
    
    if (color[0] === "#") {
        color = color.slice(1);
        usePound = true;
    }
    
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    
    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);
    
    return (usePound ? "#" : "") + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0');
}