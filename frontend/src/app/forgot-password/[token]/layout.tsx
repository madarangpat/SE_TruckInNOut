import "./layout.css";

export default function ForgotPWLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
