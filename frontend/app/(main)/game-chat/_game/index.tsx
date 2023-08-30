"use client";

import Image from "next/image";
import pong from "/public/images/pong.gif";
import lightPong from "public/images/light-pong.gif";
import { useTheme } from "next-themes";
import ProfileSettings from "./components/profile-settings"
import PlayButtons from "./components/play_buttons";

export default function Game() {
  const { theme } = useTheme();

  if (!theme) {
    return <></>;
  }

  return (
    <>
      <Image
        src={theme === "dark" ? pong : lightPong}
        alt="pong gif"
        className="mx-auto xl:mt-32 h-[50%] w-[60%] lg:block"
      />
      <ProfileSettings />
      <PlayButtons />
    </>
  );
}
