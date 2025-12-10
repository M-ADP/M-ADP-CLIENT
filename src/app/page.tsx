'use client'
import Button from "@/components/ui/Button/ui";
import Input from "@/components/ui/Input/ui";

export default function Home() {
  return (
    <div>
      <Button variant="confirm" onClick={() => alert('Confirmed!')} />
      <Input
        width={400}
        label="프로젝트 명"
        placeholder="예: Kill Dongwookki"
      />
      <Input
        width={400}
        label="프로젝트 명"
        placeholder="예: Kill Dongwookki"
      />
      <Input
        width={400}
        label="프로젝트 명"
        placeholder="예: Kill Dongwookki"
      />
      <Input
        width={400}
        label="프로젝트 명"
        placeholder="예: Kill Dongwookki"
      />
      <h1>M-ADP</h1>
    </div>
  );
}
