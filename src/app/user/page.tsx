import UserContent from "@/components/Content/UserContent";

export default function Page() {
  return (
    <div
      style={{
        width: "100vw",
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UserContent />
    </div>
  );
}