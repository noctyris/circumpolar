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
        <div className="flex items-center justify-center rounded-3xl p-px bg-gradient-to-b from-gray-200 to-transparent">
            <div className="">
                <form action={formAction}>
                    <div>
                        <h1>Please log in to continue</h1>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" placeholder="password" required minLength={6} />
                        </div>
                    </div>
                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                    <button aria-disabled={isPending}>Connexion</button>
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
