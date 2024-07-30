import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"] });

export const Logo = () => (
  <div
    className={`text-center ${raleway.className} text-3xl capitalize border-b border-yellow-500`}
  >
    <span className={` text-yellow-500`}>Two</span>{" "}
    <span className=" text-yellow-500">Crowns</span>
  </div>
);
