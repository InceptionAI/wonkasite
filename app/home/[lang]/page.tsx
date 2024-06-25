import Navbar from "@/components/layout/navbar";
import { DataType } from "@/server/fetch-data";
import { Locale, localesDetails } from "@/types/languages";

type HomePageProps = {
  params: { lang: Locale };
};

const data: DataType = {
  uiContent: {
    companyName: "Your Company",
    description: "Welcome to our website",
    footer: {
      legal: "",
      notice: "",
      navigation: [],
      design: "",
      crafted: "",
    },
    checkout: "Proceed to checkout",
    navigation: [],
    // Add the other missing properties here
    checkoutAfter: "",
    getStarted: "",
    mission: "",
    readMore: "",
    siteName: "Wonkasite",
    slogan: "Focus on your business, we take care of the rest",
    profileMenu: [
      { title: "Profil", path: "/profile" },
      { title: "Administration", path: "/admin" },
      { title: "Déconnexion", path: "/sign-out" },
    ],
  },
  storage: {
    logo: {
      navbar: {
        src: "https://firebasestorage.googleapis.com/v0/b/wonkasite-d43b5.appspot.com/o/wonkasite%2Flogo-wonka-nobg.png?alt=media&token=abf6a1fa-95a8-45bf-adaf-e935e9b9b221",
        aspectRatio: 1,
        inceptionLogo: true,
      },
    },
  },
  features: {
    navbar: {
      fixed: true,
    },
    borderMenuNav: true,
    footer: {
      type: {
        map: false,
        location: "somewhere",
        choice: "simple",
        contactForm: true,
      },
    },
  },
  domain: "",
  upcomingEvents: undefined,
};
const HomePage = ({ params }: HomePageProps) => {
  const locale = localesDetails[params.lang];

  return (
    <div className="flex">
      <div className="flex flex-col">
        <Navbar domain={"local-108"} data={data} locale={locale} />
      </div>
      <div className="m-auto flex flex-col justify-center pt-52"></div>
    </div>
  );
};

export default HomePage;
