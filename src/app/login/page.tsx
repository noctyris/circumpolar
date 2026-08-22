"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    // p-px bg-gradient-to-b from-gray-200 to-transparent

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Connexion nécessaire</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Mot de passe</label>
                        <div className="mt-2">
                            <input type="password" name="password" required minLength={6} className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-white/50 sm:text-sm/6" />
                        </div>
                    </div>
                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                    <div>
                        <button type="submit" aria-disabled={isPending} className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70">Connexion</button>
                    </div>
                    <div aria-live="polite" aria-atomic="true">
                        {errorMessage && (
                            <p className="text-red-500">{errorMessage}</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
