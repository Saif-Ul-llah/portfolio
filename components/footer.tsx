export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} John Doe. All rights reserved.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Built with
            <span className="mx-1 text-red-500">❤</span>
            using Next.js, Three.js, and Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
}