import { C } from '../../constants/theme';

const GStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; background: ${C.bg}; font-family: 'DM Sans', sans-serif; color: ${C.text}; }
    h1, h2, h3, h4, h5 { font-family: 'Outfit', sans-serif; }
    input, button, select { font-family: inherit; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

    .sb-item:hover { background: ${C.pLight} !important; }
    .sb-item:hover span { color: ${C.primary} !important; }

    .card-hover:hover { transform: translateY(-2px); box-shadow: ${C.shMd} !important; }

    .btn-primary:hover { background: ${C.primaryD} !important; }
    .btn-green:hover   { background: ${C.greenD} !important; }

    .sos-btn:hover {
      transform: scale(1.06) !important;
      box-shadow: 0 0 50px rgba(220,38,38,.55) !important;
    }

    input:focus {
      outline: 2px solid ${C.primary}44;
      border-color: ${C.primary} !important;
    }

    @keyframes fadeIn  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse   { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.04); } }

    .fade-in { animation: fadeIn 0.3s ease forwards; }
    .pulse   { animation: pulse 2s infinite; }
  `}</style>
);

export default GStyle;
