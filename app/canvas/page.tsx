// pages/index.js
export default function Home() {
  return (
    <div className="relative min-h-screen bg-cover bg-right bg-no-repeat" style={{ backgroundImage: "url('/homebg.svg')" }}>
      {/* <div className="absolute inset-0 bg-black opacity-50" /> */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-5xl font-bold">LEAPDRAW</h1>
        <p className="text-lg">Built using Next.js</p>
      </div>
    </div>
  );
}
