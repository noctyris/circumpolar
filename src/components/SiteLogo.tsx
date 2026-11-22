import Image from "next/image";
import Link from "next/link";

export default function SiteLogo() {
  return (
    <Link href="/" aria-label="Circumpolar — retour à la galerie" className="inline-flex items-end">
      <span>Circump</span>
      <Image
        src="/circumpolar-mark.png"
        alt=""
        width={64}
        height={64}
        priority
        className="mx-[0.06em] mb-[0.02em] inline-block h-[0.95em] w-[0.95em] rounded-full object-contain"
      />
      <span>lar</span>
    </Link>
  );
}
