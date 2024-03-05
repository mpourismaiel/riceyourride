import Link from "next/link";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const PageHeader = ({
  title,
  link,
  shouldGoBack,
  children,
}: {
  title: string;
  link?: string;
  shouldGoBack?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-4 mt-8">
      <div className="flex gap-2 items-center">
        {shouldGoBack && (
          <Link href="/best/1" className="text-foreground text-3xl">
            <HiOutlineChevronLeft />
          </Link>
        )}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {link && (
          <Link href="/best/1" className="text-foreground text-3xl">
            <HiOutlineChevronRight />
          </Link>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
