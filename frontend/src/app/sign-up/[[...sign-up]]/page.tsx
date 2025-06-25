import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 clerk-container-center">
      <SignUp forceRedirectUrl="/dashboard" appearance={{ elements: { socialButtons: { display: 'none' } } }} />
      <div className="mt-6 text-center">
        <Link href="/" className="text-primary font-medium hover:underline">Back to Home</Link>
      </div>
    </div>
  );
} 