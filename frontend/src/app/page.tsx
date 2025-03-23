"use client";

import Link from "next/link";
import Image from "next/image";

const WelcomePage = () => {
  return (
    <div className="mesh-gradient h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-black/80">
          WELCOME TO
        </h2>
        <Image
          src="/tinowlabel2.png"
          alt="Truckin-N-Out Logo"
          width={250}
          height={250}
          className="w-40 md:w-64"
        />
      </div>

      <Link href="/login">
        <button className="mt-8 px-8 py-4 text-lg font-semibold text-black tracking-widest shadow-lg transition-all duration-300 ease-in-out get-started-btn">
          G E T &nbsp; S T A R T E D
        </button>
      </Link>
    </div>
  );
};

export default WelcomePage;
