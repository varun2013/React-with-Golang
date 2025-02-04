interface FooterLink {
  title: string;
  path: string;
}
interface footerItem {
  title: string;
  links: FooterLink[];
}
export const footerMenu: footerItem[] = [
  {
    title: "Company",
    links: [
      {
        title: "Home",
        path: "https://www.theranostics.co.nz/",
      },
      {
        title: "About us",
        path: "https://www.theranostics.co.nz/about-us/",
      },
      {
        title: "FAQs",
        path: "https://www.theranostics.co.nz/faqs/",
      },

      {
        title: "Privacy",
        path: "https://www.theranostics.co.nz/privacy/",
      },
      {
        title: "Contact",
        path: "https://www.theranostics.co.nz/contact/",
      },
    ],
  },
  {
    title: "Product",
    links: [
      {
        title: "Products",
        path: "https://www.theranostics.co.nz/products/",
      },
      {
        title: "Personalisation",
        path: "https://www.theranostics.co.nz/personalisation/",
      },
      {
        title: "How it Works",
        path: "https://www.theranostics.co.nz/how-it-works/",
      },

      {
        title: "For Clinicians",
        path: "https://www.theranostics.co.nz/for-clinicians/",
      },
    ],
  },
];
