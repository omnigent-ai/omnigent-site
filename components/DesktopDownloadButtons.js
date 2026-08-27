import { AppleIcon } from "@/components/icons";
import {
  LINUX_DEB_DOWNLOAD_URL,
  MACOS_DOWNLOAD_URL,
  WINDOWS_DOWNLOAD_URL,
} from "@/components/links";
import Image from "next/image";

function PlatformIcon({ path }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  );
}

export default function DesktopDownloadButtons() {
  return (
    <p style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
      <a href={MACOS_DOWNLOAD_URL} className="btn btn-primary">
        <AppleIcon size={15} />
        Download for Apple silicon
      </a>
      <a href={WINDOWS_DOWNLOAD_URL} className="btn">
        <PlatformIcon path="M3 12V6.75l6-1.32v6.48L3 12m17-9v8.75l-10 .15V5.21L20 3M3 13l6 .09v6.81l-6-1.15V13m17 .25V22l-10-1.91V13.1l10 .15Z" />
        Download for Windows
      </a>
      <a href={LINUX_DEB_DOWNLOAD_URL} className="btn">
        <Image src="/linux.svg" alt="" width={15} height={15} />
        Download for Linux
      </a>
    </p>
  );
}
