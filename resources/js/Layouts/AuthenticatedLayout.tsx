import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen text-gray-900 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
            <nav className="bg-white border-b border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link href="/">
                                    <img
                                        src="/logo.webp"
                                        alt="Logo"
                                        className="h-9"
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user.role === "admin" ? (
                                    <>
                                        <NavLink
                                            href={route("admin.dashboard")}
                                            active={route().current(
                                                "admin.dashboard"
                                            )}
                                        >
                                            Inicio
                                        </NavLink>
                                        <NavLink
                                            href={route(
                                                "admin.classrooms.index"
                                            )}
                                            active={route().current(
                                                "admin.classrooms.index"
                                            )}
                                        >
                                            Aulas
                                        </NavLink>
                                        <NavLink
                                            href={route("admin.exams.index")}
                                            active={route().current(
                                                "admin.exams.index"
                                            )}
                                        >
                                            Exámenes
                                        </NavLink>
                                        <NavLink
                                            href={route("admin.teachers.index")}
                                            active={route().current(
                                                "admin.teachers.index"
                                            )}
                                        >
                                            Docentes
                                        </NavLink>
                                    </>
                                ) : (
                                    <NavLink
                                        href={route("teacher.dashboard")}
                                        active={route().current(
                                            "teacher.dashboard"
                                        )}
                                    >
                                        Inicio
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Cambiar contraseña
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="flex items-center -me-2 sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="w-6 h-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        {user.role === "admin" ? (
                            <>
                                <ResponsiveNavLink
                                    href={route("admin.dashboard")}
                                    active={route().current("admin.dashboard")}
                                >
                                    Inicio
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("admin.classrooms.index")}
                                    active={route().current(
                                        "admin.classrooms.index"
                                    )}
                                >
                                    Aulas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("admin.exams.index")}
                                    active={route().current(
                                        "admin.exams.index"
                                    )}
                                >
                                    Exámenes
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("admin.teachers.index")}
                                    active={route().current(
                                        "admin.teachers.index"
                                    )}
                                >
                                    Docentes
                                </ResponsiveNavLink>
                            </>
                        ) : (
                            <ResponsiveNavLink
                                href={route("teacher.dashboard")}
                                active={route().current("teacher.dashboard")}
                            >
                                Inicio
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.role === "admin" ? (
                                    <span>Administrador</span>
                                ) : user.teachers?.length > 0 ? (
                                    <span>
                                        Aula:{" "}
                                        {
                                            user.teachers[
                                                user.teachers.length - 1
                                            ].section
                                        }
                                    </span>
                                ) : (
                                    <span>Sin aula seleccionada</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800">
                    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
