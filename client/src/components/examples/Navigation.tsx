import Navigation from "../Navigation";

export default function NavigationExample() {
  return (
    <div className="h-screen bg-gradient-to-b from-muted to-background">
      <Navigation
        isLoggedIn={false}
        onLoginClick={() => console.log("Login clicked")}
        onLogout={() => console.log("Logout clicked")}
      />
    </div>
  );
}
