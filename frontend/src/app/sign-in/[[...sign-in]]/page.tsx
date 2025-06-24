import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 clerk-container-center">
      <SignIn forceRedirectUrl="/dashboard" appearance={{ elements: { socialButtons: { display: 'none' } } }} />
    </div>
  );
} 