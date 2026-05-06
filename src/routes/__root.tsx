import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfaf6] px-4 font-sans">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-stone-800">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-stone-700">Halaman tidak dijumpai</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#a64027] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8b3520]"
          >
            Kembali ke Laman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ladang Pro — Carbon Decision Support for Farmers" },
      { name: "description", content: "Calculate farm carbon emissions and get the top 3 actions to reduce them." },
      { name: "author", content: "Rime" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Since we removed the sidebar, every page is now full-screen!
  return (
    <div className="min-h-screen w-full bg-[#fbfaf6]">
      <Outlet />
    </div>
  );
}