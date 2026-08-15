'use server';
 
import { signIn } from '@root/auth';
import { AuthError } from 'next-auth';
 
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const password = formData.get("password") as string;
        const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

        await signIn('credentials', {
            password, redirectTo
        });
    } catch (error) {
        if (error instanceof AuthError) {
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
