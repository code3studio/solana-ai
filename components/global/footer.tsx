export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6">
        <p className="text-sm text-muted-foreground">
          © 2024 Your Company. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
