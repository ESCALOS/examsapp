import { Head, Link } from "@inertiajs/react";

export default function Home() {
    return (
        <>
            <Head title="Inicio" />
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-500">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-primary-500">
                        Bienvenido a I.E 22358
                    </h1>
                </header>
                <main className="text-center">
                    <p className="mb-8 text-xl text-accent-500">
                        Innovación y excelencia en cada proyecto
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center px-4 py-2 mr-2 font-bold transition-colors duration-300 rounded-lg bg-primary-500 text-secondary-500 hover:bg-accent-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                            />
                        </svg>
                        Acceder a Intranet
                    </Link>
                </main>
                <footer className="mt-16 text-sm text-primary-500">
                    <p>&copy; 2024 I.E 22358. Todos los derechos reservados.</p>
                </footer>
            </div>
        </>
    );
}
