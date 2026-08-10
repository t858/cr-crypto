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
    setClickCount((prev) => prev + 1);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 800);

    if (clickCount + 1 >= 4) {
      e.preventDefault();
      setIsModalOpen(true);
      setClickCount(0);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  return (
    <>
      <Link href="/" onClick={handleLogoClick}>
        <img
          src="/images/logo/pionex-logo.png"
          alt="Pionex Logo"
          className="h-8 sm:h-9 w-auto object-contain"
        />
      </Link>

      {isModalOpen && <AdminSecretLoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Logo;
