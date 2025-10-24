import LoginCard from "@/components/Login/LoginCard";

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
      <LoginCard />
    </div>
  );
}
