export default function Page() {
  const style: any = {
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
      <div style={{ ...style.container }}>
        <h1>This is admin page</h1>
      </div>
  );
}
