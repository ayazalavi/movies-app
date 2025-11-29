

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full">
            {/* Mobile SVG */}
            <div className="hidden md:block">
                <Image
                    src="/bg.svg"
                    alt="decorative footer wave"
                    width={1440}          // set intrinsic width (svg doesn't care)
                    height={111}           // height scales automatically (preserves aspect ratio)
                    className="w-full h-auto"
                    priority
                />
            </div>
            <div className="mt-auto w-full md:hidden">
                <Image
                    src="/bg-mobile.svg"
                    alt="decorative footer wave"
                    width={428}          // set intrinsic width (svg doesn't care)
                    height={111}           // height scales automatically (preserves aspect ratio)
                    className="w-full h-auto"
                    priority
                />
            </div>
        </footer>
    );
}
