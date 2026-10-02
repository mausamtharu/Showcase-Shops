export declare const auth: import("better-auth").Auth<{
    baseURL: any;
    secret: any;
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
    };
    plugins: [{
        id: "sveltekit-cookies";
        version: string;
        hooks: {
            after: {
                matcher(): true;
                handler: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>>;
            }[];
        };
    }];
}>;
