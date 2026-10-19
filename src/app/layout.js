import "../styles/global.css";

export const metadata = {
  title: "NIVRA - Hyper-Local Micro-Gigs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
