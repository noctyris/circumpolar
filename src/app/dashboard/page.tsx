import Link from "next/link"

export default function DashboardPage() {
    return (
        <>
            <Link className="fixed flex justify-center items-center text-4xl bottom-6 right-6 w-12 rounded-full h-12 duration-300 bg-white/50 hover:bg-white/70 hover:text-6xl" href="dashboard/new">+</Link>
            {/*  TODO: NEW SECTION INCOMING  */}
            <code className="text-white/60 italic tracking-wider">Nothing here yet... except this button</code>
        </>
    )
}
