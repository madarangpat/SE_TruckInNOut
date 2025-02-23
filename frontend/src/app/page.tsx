import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-200 relative">
      {/* Background Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-yellow-300 to-green-600 blur-2xl opacity-40"></div>

      {/* Content Card */}
      <div className="relative z-10 text-center bg-white/50 backdrop-blur-md p-10 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mt-4 text-gray-900">WELCOME TO</h1>
        {/* Truck Logo */}
        <div className="flex justify-center">
          <Image src="/tinoicon.png" alt="Truckin-N-Out Logo" width={120} height={120} />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800">TRUCKIN-N-OUT</h2>

        {/* Get Started Button */}
        <Link href="/login">
            <button className="mt-8 px-[50px] py-[14px] bg-black/10 text-black text-xl font-medium tracking-[7px] rounded-xl shadow-lg border border-white backdrop-blur-[35px] transition-all duration-300 hover:scale-105 hover:bg-black/20">
                GET STARTED
            </button>
        </Link>
      </div>
    </main>
  );
}
