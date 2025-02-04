import { HELP_APP_URL, KIT_REGISTER_APP_URL } from "./appUrl";

interface HeaderItem {
  title: string;
  path: string;
}
export const kitRegisterHeaderMenu: HeaderItem[] = [
  // {
  //   title: "Home",
  //   path: "https://www.theranostics.co.nz/",
  // },
  // {
  //   title: "Products",
  //   path: "https://www.theranostics.co.nz/products/",
  // },
  // {
  //   title: "Personalisation",
  //   path: "https://www.theranostics.co.nz/personalisation/",
  // },
  {
    title: "Help",
    path: HELP_APP_URL,
  },
  {
    title: "Kit Register",
    path: KIT_REGISTER_APP_URL,
  },
  // {
  //   title: "For Clinicians",
  //   path: "https://www.theranostics.co.nz/for-clinicians/",
  // },
  // {
  //   title: "FAQs",
  //   path: "https://www.theranostics.co.nz/faqs/",
  // },
  // {
  //   title: "About us",
  //   path: "https://www.theranostics.co.nz/about-us/",
  // },
  // {
  //   title: "Privacy",
  //   path: "https://www.theranostics.co.nz/privacy/",
  // },
  // {
  //   title: "Contact",
  //   path: "https://www.theranostics.co.nz/contact/",
  // },
];
