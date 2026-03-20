export function TacticalCorners() {
  return (
    <>
      <div className="fixed top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/20 pointer-events-none z-50" />
      <div className="fixed top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 pointer-events-none z-50" />
      <div className="fixed bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 pointer-events-none z-50" />
      <div className="fixed bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 pointer-events-none z-50" />
    </>
  );
}
