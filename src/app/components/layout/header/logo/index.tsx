"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { AdminSecretLoginModal } from "./AdminModal";

const Logo: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Increment clicks
    setClickCount((prev) => prev + 1);

    // Reset the timer every click. If they don't click again within 800ms, reset to 0.
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 800);

    // If this is the 4th click, prevent navigation and open the secret modal
    if (clickCount + 1 >= 4) {
      e.preventDefault();
      setIsModalOpen(true);
      setClickCount(0); // Reset after success
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  return (
    <>
      <Link href="/" onClick={handleLogoClick}>
        <Image
          src="/images/logo/logo.svg"
          alt="logo"
          width={160}
          height={50}
          style={{ width: "auto", height: "auto" }}
          quality={100}
        />
      </Link>

      {isModalOpen && <AdminSecretLoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Logo;
