import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TotalsCardProps = {
  title: string;
  total: number;
  color: string;
  description: string;
};

export default function TotalsCard({
  title,
  total,
  color,
  description,
}: TotalsCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <h1 className={`${color} text-3xl`}>{total}</h1>
        <p className="text-[#6C757D]">{description}</p>
      </CardContent>
    </Card>
  );
}
