'use server';
 
import { headers } from 'next/headers';
import { signIn } from '@root/auth';
import { AuthError } from 'next-auth';
import { fetchSingleImage } from './data';
import { clearFailures, isRateLimited, recordFailure } from './rate-limit';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IP = 5;
const MAX_FAILURES_GLOBAL = 30;

function clientIp(headersList: Headers): string {
    const forwarded = headersList.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return headersList.get('x-real-ip') ?? 'unknown';
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const ip = clientIp(await headers());
    const ipKey = `login:ip:${ip}`;
    const globalKey = 'login:global';

    if (
        isRateLimited(ipKey, MAX_FAILURES_PER_IP, WINDOW_MS) ||
        isRateLimited(globalKey, MAX_FAILURES_GLOBAL, WINDOW_MS)
    ) {
        return 'Trop de tentatives. Réessayez dans quelques minutes.';
    }

    try {
        const password = formData.get("password") as string;
        const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

        await signIn('credentials', {
            password, redirectTo
        });

        clearFailures(ipKey);
        return undefined;
    } catch (error) {
        if (error instanceof AuthError) {
            recordFailure(ipKey, WINDOW_MS);
            recordFailure(globalKey, WINDOW_MS);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function getImageAction(id: string) {
    const imageInList = await fetchSingleImage(id)
    return imageInList[0];
}
