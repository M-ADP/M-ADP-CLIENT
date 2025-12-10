'use client'
import Button from "@/components/ui/Button/ui";

export default function Home() {
  return (
    <div>
      <Button variant="confirm" onClick={() => alert('Confirmed!')} />
      <h1>M-ADP</h1>
    </div>
  );
}
