// Build config for css/tailwind.css. Rebuild after adding or changing Tailwind classes:
//   npx tailwindcss@3.4.17 -i css/tailwind.src.css -o css/tailwind.css --minify
module.exports = {
    content: ['./index.html', './js/**/*.js'],
    theme: {
        extend: {
            colors: {
                primary: '#6366F1',
                secondary: '#8B5CF6',
                accent: '#EC4899',
                dark: '#0F172A',
                darker: '#020617',
                light: '#F8FAFC',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            animation: {
                'gradient': 'gradient 8s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    'from': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
                    'to': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)' },
                },
                slideUp: {
                    'from': { transform: 'translateY(100px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    'from': { transform: 'translateY(-100px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
};
