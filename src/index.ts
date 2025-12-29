import express, { Request, Response, Application } from 'express';
import path from 'path';
import { websiteConfig, adjustColor } from './config';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Log environment untuk debugging
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    __dirname: __dirname,
    cwd: process.cwd()
});

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set views path - handle both Vercel and local development
if (process.env.VERCEL) {
    // Di Vercel, views ada di root project
    app.set('views', path.join(process.cwd(), 'views'));
    // Static files
    app.use('/css', express.static(path.join(process.cwd(), 'public/css')));
    app.use('/js', express.static(path.join(process.cwd(), 'public/js')));
    app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));
} else {
    // Di local development
    app.set('views', path.join(__dirname, '../views'));
    app.use('/css', express.static(path.join(__dirname, '../public/css')));
    app.use('/js', express.static(path.join(__dirname, '../public/js')));
    app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route dengan EJS
app.get('/', (req: Request, res: Response) => {
    try {
        const colors = {
            primary: websiteConfig.primaryColor,
            primaryDark: websiteConfig.primaryDark,
            primaryLight: websiteConfig.primaryLight,
            dark: websiteConfig.darkColor,
            light: websiteConfig.lightColor,
            accent: websiteConfig.accentColor,
            discord: '#5865f2'
        };
        
        res.render('index', {
            config: websiteConfig,
            colors: colors,
            serverAddress: `${websiteConfig.serverIP}:${websiteConfig.serverPort}`,
            currentYear: new Date().getFullYear(),
            adjustedColors: {
                primaryDark: adjustColor(websiteConfig.primaryColor, -30),
                primaryLight: adjustColor(websiteConfig.primaryColor, 30)
            }
        });
    } catch (error) {
        console.error('Error rendering index:', error);
        res.status(500).send(`
            <html>
                <body>
                    <h1>Server Error</h1>
                    <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
                </body>
            </html>
        `);
    }
});

// Health check endpoint untuk Vercel
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: websiteConfig.serverName,
        version: '1.0.0',
        node: process.version
    });
});

// Serve manifest.json
app.get('/manifest.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        name: websiteConfig.title,
        short_name: websiteConfig.serverName,
        description: websiteConfig.description,
        start_url: '/',
        display: 'standalone',
        background_color: websiteConfig.darkColor,
        theme_color: websiteConfig.primaryColor,
        orientation: 'portrait',
        icons: [
            {
                src: '/assets/icon-192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/assets/icon-512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    });
});

// Fallback untuk semua route lainnya
app.get('*', (req: Request, res: Response) => {
    res.redirect('/');
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        server: websiteConfig.serverName,
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// Start server hanya di local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📁 Views path: ${app.get('views')}`);
        console.log(`🎨 Primary color: ${websiteConfig.primaryColor}`);
    });
}

// Export untuk Vercel (WAJIB untuk Vercel Functions)
export default app;