import { cn } from "../../lib/cn";

const PageContainer = ({ children, className = "" }) => (
  <main className={cn("mx-auto flex w-full max-w-[92rem] flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8", className)}>
    {children}
  </main>
);

export default PageContainer;
