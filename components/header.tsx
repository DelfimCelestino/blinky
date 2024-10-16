import Image from "next/image";
import { AddProjectButton } from "@/components/add-project-button";

const Header = () => {
  return (
    <div className="z-50 container mx-auto h-16 fixed top-0 left-0 right-0 bg-background flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 lg:h-16 lg:w-20">
          <Image
            src="/icon.png"
            alt="logo"
            fill
            sizes="(max-width: 1024px) 40px, 80px"
            className="object-cover"
            priority
          />
        </div>
        <h1>Blinky</h1>
      </div>
      <AddProjectButton />
    </div>
  );
};

export default Header;
