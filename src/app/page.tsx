'use client'
import Sidebar from "@/components/ui/Sidebar/ui";

export default function Home() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#0F123B', minHeight: '100vh', color: 'white' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '30px', marginLeft: '280px' }}>
        {/* Content cleared as requested */}
      </div>
    </div>
  );
}
