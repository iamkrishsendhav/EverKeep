import { ArrowLeft } from "lucide-react";
import Button from "../ui/Button";

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-[#FCFCFD] px-4 py-12">
    <div className="max-w-md text-center">
      <p className="text-sm font-bold text-[#5B4BFF]">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Page not found</h1>
      <p className="mt-3 text-base leading-8 text-slate-600">The page you are looking for does not exist or may have moved.</p>
      <Button className="mt-7" onClick={() => window.history.back()}>
        <ArrowLeft size={17} />
        Go back
      </Button>
    </div>
  </main>
);

export default NotFound;
