import StationCard from "../StationCard";

export default function StationCardExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <StationCard
          name="DLF Cyber Hub Station"
          address="DLF Cyber City, Sector 24, Gurugram, Haryana"
          distance="2.3 km"
          connectorTypes={["CCS", "CHAdeMO", "Type 2"]}
          pricePerKwh={12}
          availability="available"
          onBookClick={() => console.log("Book clicked")}
          onViewDetails={() => console.log("View details clicked")}
        />
        <StationCard
          name="MG Road Charging Hub"
          address="MG Road, Sector 28, Gurugram, Haryana"
          distance="4.1 km"
          connectorTypes={["CCS", "Type 2"]}
          pricePerKwh={15}
          availability="busy"
          onBookClick={() => console.log("Book clicked")}
          onViewDetails={() => console.log("View details clicked")}
        />
        <StationCard
          name="Golf Course Station"
          address="Golf Course Road, Sector 54, Gurugram"
          distance="5.8 km"
          connectorTypes={["CCS", "CHAdeMO"]}
          pricePerKwh={10}
          availability="offline"
          onBookClick={() => console.log("Book clicked")}
          onViewDetails={() => console.log("View details clicked")}
        />
      </div>
    </div>
  );
}
