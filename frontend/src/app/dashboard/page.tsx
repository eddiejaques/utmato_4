import { CampaignList } from "@/components/Campaigns/CampaignList";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
      <CampaignList />
    </div>
  );
} 