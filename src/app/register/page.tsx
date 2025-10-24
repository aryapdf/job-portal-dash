import OnboardingCard from "@/components/Card/OnboardingCard";

export default function Home() {
  const style:any = {
    container: {
      width: "100vw",
      height: "100vh",
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
        <OnboardingCard />
      </div>
  );
}
