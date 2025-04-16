import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold mb-10">Landing Page</h1>
			<Link
				href="/login"
				className="border rounded-md px-2 py-1 cursor-pointer"
			>
				<button type="button">Login</button>
			</Link>
		</div>
	);
}
