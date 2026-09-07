import Link from "next/link";
import { fetchImages } from "../lib/data";

export default async function DashboardPage() {
    const images = await fetchImages();

    return (
        <>
            <div>
                {images.length} images
            </div>

            <div className="sticky bottom-6 self-end pointer-events-none z-30 mt-auto">
                <Link
                    href="dashboard/new"
                    className="pointer-events-auto flex justify-center items-center text-4xl w-12 h-12 rounded-full duration-300 bg-white/50 hover:bg-white/70 hover:text-6xl shadow-lg -mr-7"
                >
                    +
                </Link>
            </div>
        </>
    );
}
