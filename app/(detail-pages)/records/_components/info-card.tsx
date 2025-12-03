type InfoCardProps = {
  title: string;
  description: string | number;
};

export default function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="flex-1">
      <p className="text-[#6C757D]">{title}</p>
      <h1 className="font-semibold">{description}</h1>
    </div>
  );
}
