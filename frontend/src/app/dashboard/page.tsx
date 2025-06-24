'use client';

import { CampaignList } from "@/components/Campaigns/CampaignList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Header } from "@/components/organisms/Header";
import { SignedIn } from "@clerk/nextjs";

export default function DashboardPage() {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading || !isAuthenticated) {
    return <div>Loading session...</div>;
  }

  return (
    <>
      <SignedIn>
        <Header />
      </SignedIn>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
        <CampaignList />
      </div>
    </>
  );
} 