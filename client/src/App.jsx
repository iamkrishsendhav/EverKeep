import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.12),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)] text-slate-950 antialiased">
      <AppRoutes />
    </div>
  );
}

export default App;
