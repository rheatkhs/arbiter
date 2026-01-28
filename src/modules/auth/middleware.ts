import { Elysia } from "elysia";
import { auth } from "../../auth";

export const authMiddleware = new Elysia()
    .derive(async ({ request }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        return {
            user: session?.user,
            session: session?.session
        };
    })
    .macro(({ onBeforeHandle }) => ({
        // Guard to ensure user is logged in
        isSignedIn(enabled: boolean) {
            if (!enabled) return;
            onBeforeHandle(({ user, set }) => {
                if (!user) {
                    set.status = 401;
                    return { error: "Unauthorized" };
                }
            });
        },
        // Guard to ensure user is admin
        item(role: 'admin') {
            onBeforeHandle(({ user, set }) => {
                if (!user || user.role !== 'admin') {
                    set.status = 403;
                    return { error: "Forbidden: Admins only" };
                }
            });
        }
    }));
