'use server';

import { headers } from 'next/headers';
import { auth, signIn } from '@root/auth';
import { AuthError } from 'next-auth';
import { fetchSingleImage } from './data';
import { clearFailures, isRateLimited, recordFailure } from './rate-limit';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IP = 5;

function clientIp(headersList: Headers): string {
    const realIp = headersList.get('x-real-ip')?.trim();
    if (realIp) return realIp;

    const forwarded = headersList.get('x-forwarded-for');
    if (forwarded) {
        // Le dernier maillon est celui ajouté par le proxy le plus proche.
        return forwarded.split(',').at(-1)?.trim() || 'unknown';
    }

    return 'unknown';
}

function safeRedirect(value: FormDataEntryValue | null): string {
    const path = typeof value === 'string' ? value : '';
    if (!path.startsWith('/') || path.startsWith('//')) return '/dashboard';
    return path;
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const ip = clientIp(await headers());
    const ipKey = `login:ip:${ip}`;

    if (await isRateLimited(ipKey, MAX_FAILURES_PER_IP, WINDOW_MS)) {
        return 'Trop de tentatives. Réessayez dans quelques minutes.';
    }

    const password = String(formData.get('password') ?? '');
    const redirectTo = safeRedirect(formData.get('redirectTo'));

    try {
        await signIn('credentials', {
            password,
            redirectTo,
        });

        await clearFailures(ipKey);
        return undefined;
    } catch (error) {
        if (error instanceof AuthError) {
            await recordFailure(ipKey, WINDOW_MS);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Mot de passe incorrect.';
                default:
                    return 'Connexion impossible. Réessayez.';
            }
        }
        throw error;
    }
}

export async function getImageAction(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');
    if (!/^\d+$/.test(id)) return undefined;

    const imageInList = await fetchSingleImage(id);
    return imageInList[0];
}
