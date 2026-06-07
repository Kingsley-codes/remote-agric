import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  paths: BreadcrumbItem[];
}

export const Breadcrumbs = ({ paths }: BreadcrumbsProps) => (
  <nav className="flex flex-wrap gap-2 text-sm">
    {paths.map((item, idx) => {
      const isLast = idx === paths.length - 1;

      return (
        <span key={item.href} className="flex items-center gap-2">
          {idx > 0 && <span className="text-gray-400">/</span>}

          {isLast ? (
            <span className="text-primary font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-primary-dark font-medium"
            >
              {item.label}
            </Link>
          )}
        </span>
      );
    })}
  </nav>
);
