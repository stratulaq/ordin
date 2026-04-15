import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Ordin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Ordin`,
  meta: {
    title: "Ordin",
    description:
      "Ordin Dashboard",
  },
};
