import OnboardingCard from "@/components/Card/OnboardingCard";

export default function Home() {
  const style:any = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }
  }

  return (
    <div style={{
      ...style.container
    }}>
      <h1>This is root page</h1>
    </div>
  );
}
